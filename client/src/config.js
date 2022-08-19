let BASE_URL;
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  BASE_URL = "/";
}
else
{
  BASE_URL ="/"
}

export { BASE_URL };
