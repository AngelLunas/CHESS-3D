import type { Context } from "@netlify/edge-functions";

// Regiones de servidores de juego disponibles
const GAME_SERVERS = {
  "NA": { region: "North America", endpoint: "wss://na.chess3d.game", countries: ["US", "CA", "MX"] },
  "EU": { region: "Europe", endpoint: "wss://eu.chess3d.game", countries: ["ES", "FR", "DE", "IT", "GB", "PT", "NL", "BE"] },
  "SA": { region: "South America", endpoint: "wss://sa.chess3d.game", countries: ["BR", "AR", "CL", "CO", "PE", "VE"] },
  "ASIA": { region: "Asia Pacific", endpoint: "wss://asia.chess3d.game", countries: ["JP", "KR", "CN", "TW", "SG", "AU", "NZ", "IN"] },
};

// Estima latencia basada en la región (simulado)
function estimateLatency(playerRegion: string, serverRegion: string): number {
  if (playerRegion === serverRegion) return Math.floor(Math.random() * 30) + 10; // 10-40ms

  const crossRegionLatency: Record<string, Record<string, number>> = {
    "NA": { "EU": 90, "SA": 60, "ASIA": 150 },
    "EU": { "NA": 90, "SA": 180, "ASIA": 120 },
    "SA": { "NA": 60, "EU": 180, "ASIA": 250 },
    "ASIA": { "NA": 150, "EU": 120, "SA": 250 },
  };

  return crossRegionLatency[playerRegion]?.[serverRegion] || 200;
}

// Determina la mejor región para el jugador
function findBestRegion(countryCode: string | undefined): string {
  if (!countryCode) {
    console.warn("[Matchmaking] Country code not available, defaulting to NA");
    return "NA";
  }

  for (const [region, config] of Object.entries(GAME_SERVERS)) {
    if (config.countries.includes(countryCode)) {
      return region;
    }
  }

  console.log(`[Matchmaking] Country ${countryCode} not mapped, using geographic fallback`);
  return "NA"; // Default fallback
}

// Parsea el rating del jugador desde el header
function parsePlayerRating(ratingHeader: string | null): number {
  if (!ratingHeader) {
    console.error("[Matchmaking] Missing X-Player-Rating header - cannot match by skill level");
    throw new Error("MISSING_PLAYER_RATING");
  }

  const rating = parseInt(ratingHeader, 10);

  if (isNaN(rating)) {
    console.error(`[Matchmaking] Invalid rating format: "${ratingHeader}" - expected numeric value`);
    throw new Error("INVALID_RATING_FORMAT");
  }

  if (rating < 0 || rating > 3500) {
    console.error(`[Matchmaking] Rating ${rating} out of valid range (0-3500)`);
    throw new Error("RATING_OUT_OF_RANGE");
  }

  return rating;
}

// Determina el bracket de matchmaking
function getMatchmakingBracket(rating: number): string {
  if (rating < 800) return "beginner";
  if (rating < 1200) return "intermediate";
  if (rating < 1600) return "advanced";
  if (rating < 2000) return "expert";
  if (rating < 2400) return "master";
  return "grandmaster";
}

export default async (request: Request, context: Context) => {
  const startTime = Date.now();
  const requestId = crypto.randomUUID().slice(0, 8);

  console.log(`[Matchmaking] [${requestId}] New matchmaking request received`);
  console.log(`[Matchmaking] [${requestId}] Client IP: ${context.ip}`);

  // Extraer información geográfica
  const geo = context.geo;
  const countryCode = geo?.country?.code;
  const city = geo?.city;

  console.log(`[Matchmaking] [${requestId}] Geo data - Country: ${countryCode || "unknown"}, City: ${city || "unknown"}`);

  if (!geo || !countryCode) {
    console.warn(`[Matchmaking] [${requestId}] Incomplete geo data, matchmaking quality may be reduced`);
  }

  try {
    // Obtener rating del jugador
    const playerRating = parsePlayerRating(request.headers.get("X-Player-Rating"));
    const playerId = request.headers.get("X-Player-ID") || "anonymous";

    console.log(`[Matchmaking] [${requestId}] Player ${playerId} with rating ${playerRating}`);

    // Determinar mejor servidor
    const playerRegion = findBestRegion(countryCode);
    const server = GAME_SERVERS[playerRegion as keyof typeof GAME_SERVERS];
    const estimatedPing = estimateLatency(playerRegion, playerRegion);
    const bracket = getMatchmakingBracket(playerRating);

    console.log(`[Matchmaking] [${requestId}] Assigned to ${server.region} server (${bracket} bracket)`);
    console.log(`[Matchmaking] [${requestId}] Estimated latency: ${estimatedPing}ms`);

    const responseData = {
      success: true,
      requestId,
      player: {
        id: playerId,
        rating: playerRating,
        bracket,
        location: {
          country: countryCode || "unknown",
          city: city || "unknown",
        },
      },
      server: {
        region: playerRegion,
        name: server.region,
        endpoint: server.endpoint,
        estimatedPing,
      },
      matchmaking: {
        queueName: `${playerRegion.toLowerCase()}-${bracket}`,
        estimatedWaitTime: Math.floor(Math.random() * 30) + 5, // 5-35 segundos simulado
      },
      timestamp: new Date().toISOString(),
    };

    const processingTime = Date.now() - startTime;
    console.log(`[Matchmaking] [${requestId}] Request completed in ${processingTime}ms`);

    return new Response(JSON.stringify(responseData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Request-ID": requestId,
        "X-Processing-Time": `${processingTime}ms`,
        "X-Server-Region": playerRegion,
        "Cache-Control": "no-store", // No cachear matchmaking
      },
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error(`[Matchmaking] [${requestId}] Failed after ${processingTime}ms: ${errorMessage}`);

    const errorResponses: Record<string, { status: number; message: string }> = {
      "MISSING_PLAYER_RATING": { status: 400, message: "Header X-Player-Rating is required" },
      "INVALID_RATING_FORMAT": { status: 400, message: "X-Player-Rating must be a valid number" },
      "RATING_OUT_OF_RANGE": { status: 400, message: "Rating must be between 0 and 3500" },
    };

    const errorResponse = errorResponses[errorMessage] || { status: 500, message: "Internal matchmaking error" };

    return new Response(JSON.stringify({
      success: false,
      requestId,
      error: {
        code: errorMessage,
        message: errorResponse.message,
      },
      timestamp: new Date().toISOString(),
    }, null, 2), {
      status: errorResponse.status,
      headers: {
        "Content-Type": "application/json",
        "X-Request-ID": requestId,
        "X-Processing-Time": `${processingTime}ms`,
      },
    });
  }
};

export const config = {
  path: "/api/matchmaking",
};
