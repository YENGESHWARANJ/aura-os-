mkdir src\config\ai
mkdir src\config\database
mkdir src\config\redis
mkdir src\config\mail
mkdir src\config\storage

ni src\config\ai\openai.js -ItemType File
ni src\config\database\mongodb.js -ItemType File
ni src\config\redis\redis.js -ItemType File
ni src\config\mail\mailer.js -ItemType File
ni src\config\storage\cloudinary.js -ItemType File