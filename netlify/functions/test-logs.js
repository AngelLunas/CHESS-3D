exports.handler = async (event, context) => {
  // Log de información básica
  console.log("🚀 Function invoked successfully - v2");
  console.log("Request method:", event.httpMethod);
  console.log("Path:", event.path);

  // Log con datos del contexto
  console.log("Function name:", context.functionName);
  console.log("Remaining time:", context.getRemainingTimeInMillis(), "ms");

  // Simulando un proceso
  console.log("Processing request...");

  // Log de advertencia
  console.warn("⚠️ Warning: This is a test warning log");

  // Log de error (simulado)
  console.error("❌ Error: Simulated error for testing purposes");
  console.error("Error details:", {
    code: "TEST_ERROR",
    message: "This is a simulated error to test logging",
    timestamp: new Date().toISOString()
  });

  // Otro log de info
  console.log("✅ Request processed successfully");

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Test function executed successfully!",
      timestamp: new Date().toISOString(),
      logs: [
        "info: Function invoked",
        "warn: Test warning generated",
        "error: Simulated error generated"
      ]
    })
  };
};
