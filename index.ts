import 'dotenv/config';
import { RingApi } from 'ring-client-api';
import { readFile, writeFile } from 'fs';
import { promisify } from 'util';

async function frontdoorEventHandler() {
  const ringApi = new RingApi({
      refreshToken: process.env.RING_REFRESH_TOKEN!,
      debug: true,
    });
  
  const locations = await ringApi.getLocations();
  const allCameras = await ringApi.getCameras();
  const frontdoor = allCameras[0];

  console.log(
    `Found ${locations.length} location(s) with ${allCameras.length} camera(s).`
  );

  ringApi.onRefreshTokenUpdated.subscribe(
    async ({ newRefreshToken, oldRefreshToken }) => {
      console.log('Refresh Token Updated: ', newRefreshToken);

      if (!oldRefreshToken) {
        return;
      }

      const currentConfig = await promisify(readFile)('.env');
      const updatedConfig = currentConfig
          .toString()
          .replace(oldRefreshToken, newRefreshToken);

      await promisify(writeFile)('.env', updatedConfig);
    }
  );

  if (frontdoor) {
    frontdoor.onDoorbellPressed.subscribe(async ({ ding, subtype }) => {
      console.log(`Doorbell event triggered on frontdoor at ${new Date()}`);
      try {
        const response = await fetch(process.env.WEBHOOK_URL!);
        if (!response.ok) {
          throw new Error('Webhook failed')
        }
      } catch(error) {
        console.error(error)
      }
    });
    console.log('Listening for motion and doorbell presses on your cameras.');
  }
}

frontdoorEventHandler();
