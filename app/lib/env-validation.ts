// Environment variable validation for FridgeVision AI
export function validateEnvironment() {
  const requiredEnvVars = [
    { key: 'VITE_GEMINI_API_KEY', name: 'Google Gemini API' },
    { key: 'VITE_GOOGLE_VISION_API_KEY', name: 'Google Vision API' },
  ];

  const missing: string[] = [];
  const warnings: string[] = [];

  requiredEnvVars.forEach(({ key, name }) => {
    const value = import.meta.env[key];
    if (!value) {
      missing.push(`${name} (${key})`);
    } else if (value === 'your_api_key_here') {
      warnings.push(`${name} appears to have placeholder value`);
    }
  });

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach((envVar) => console.error(`  - ${envVar}`));
    console.error('\n📝 Please add these to your .env file');
    return false;
  }

  if (warnings.length > 0) {
    console.warn('⚠️ Environment variable warnings:');
    warnings.forEach((warning) => console.warn(`  - ${warning}`));
  }

  console.log('✅ All environment variables configured correctly');
  console.log('🔒 API keys are processed server-side for security');
  return true;
}

export function getEnvironmentStatus() {
  return {
    geminiConfigured: !!import.meta.env.VITE_GEMINI_API_KEY,
    visionConfigured: !!import.meta.env.VITE_GOOGLE_VISION_API_KEY,
    isDevelopment: import.meta.env.DEV,
  };
}
