import http from "@/lib/http";
//  revalidateTag giúp các page static rendering được build html chính xác lại sau mỗi lần request - https://nextjs.org/docs/app/api-reference/functions/revalidateTag
class RevalidateApiRequest {
  revalidate(tag: string) {
    return http.get(`/api/revalidate?tag=${tag}`, {
      baseUrl: "", //gọi tới next server
    });
  }
}

export const revalidateApiRequest = new RevalidateApiRequest();
