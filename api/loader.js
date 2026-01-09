export default function handler(req, res) {
  const script = `https://raw.githubusercontent.com/Scripybara/NameProtect/refs/heads/main/Swiftbara.lua
`;

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).send(script);

}
