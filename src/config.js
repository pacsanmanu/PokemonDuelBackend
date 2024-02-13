import 'dotenv/config';

const config = {
      port: process.env.PORT || 8080,
    icon: {
        url: process.env.ICON_URL,
        apiKey: process.env.ICON_API_KEY,
    },
}

export const jph = {
    url: process.env.JPH_URL,
}

export default config;
