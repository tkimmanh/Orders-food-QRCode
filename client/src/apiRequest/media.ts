import http from "@/lib/http";
import { UploadImageResType } from "@/schemaValidations/media.schema";

class MediaRequest {
  upload(file: FormData) {
    return http.post<UploadImageResType>("media/upload", file);
  }
}
export const mediaRequest = new MediaRequest();
