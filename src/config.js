import * as url from "url";
const setup = {
  PORT: "8080",
  DIRNAME: url.fileURLToPath(new URL(".", import.meta.url)),
  get UPLOAD_DIR() {
    return `${this.DIRNAME}/public/img`;
  },
};

export default setup;
