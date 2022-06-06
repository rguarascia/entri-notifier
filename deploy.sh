export CI=true
export APPLE_CERTIFICATE=$(cat certs/cert.txt)
export APPLE_CERTIFICATE_PASSWORD=$(cat certs/pass.txt)
export APPLE_ID=$(cat certs/email.txt)
export APPLE_PASSWORD=$(cat certs/pwd.txt)
export APPLE_SIGNING_IDENTITY=$(cat certs/id.txt)
yarn tauri build