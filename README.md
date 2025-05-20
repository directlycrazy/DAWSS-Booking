# DAWSS Grad Social Booking
A simple website to handle Grad Social booking for the 2025 Donald A. Wilson graduating class.

## Deployment Instructions

Deploying the booker to your own server is relatively simple. This will guide you through building the Docker image yourself.

A few expectations:
* Docker must be installed on your system
* If needed, a Docker management tool such as Dokploy or Coolify

Begin by cloning the repository. This can be done with the following
```bash
git clone https://github.com/jamescolb7/DAWSS-Booking
cd DAWSS-Booking
```

Before building the image, a few environment variables must be set. These are used in the build process and therefore needed.

### Environment Variables
```env
BETTER_AUTH_SECRET=random string
BETTER_AUTH_URL=public url of app
RESEND_KEY=email key
```

**Your Resend key can be created at [resend.com](https://resend.com) using their generous free tier**

Build the Docker image with the following
```bash
docker build --build-arg BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET --build-arg BETTER_AUTH_URL=$BETTER_AUTH_URL --build-arg RESEND_KEY=$RESEND_KEY -t dawss-booking .
```

Once your Docker image is built, you should ensure the following through your dashboard:
* The port 3000 has been exposed or mapped to a domain
* The file of `/opt/app/database.db` should be mapped to a file on your device with a **BIND MOUNT**
* Using a reverse proxy is optional, but recommended (Traefik, Nginx, Caddy)

If you aren't using a GUI to manage the container, this can be summed up in the following command:
```bash
docker run -d \
	--name=dawss_booking \
	-e BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET \
	-e BETTER_AUTH_URL=$BETTER_AUTH_URL \
	-e RESEND_KEY=$RESEND_KEY \
	-p 3000:3000 \
	-v /opt/app/database.db:/DATABASE_ON_YOUR_DEVICE \
	--restart unless-stopped \
	dawss-booking
```

That's it! You should be all set.

## Development Instructions
This assumes you have the following installed:
* Node 22 LTS
* Additional build dependencies bundled with Node (ex. Python)

Begin by cloning the repository. This can be done with the following
```bash
git clone https://github.com/jamescolb7/DAWSS-Booking
cd DAWSS-Booking
```

Install the node modules:
```bash
npm install
```

You can also generate the app database by running:
```bash
npm run migrate
```
This will use the migrations already generated to ensure your database has the correct schema. This should be run often to ensure that no changes have been made to the database schema remotely. You will likely know if this happens from unexpected app behaviour.

Before starting the development server, please refer to the Environment Variables section above. These must be set correctly for the app to start.

Run the dev server:
```bash
npm run dev
```

&copy; James Colbourne, Kush Parmar, Kirk Ding 2025