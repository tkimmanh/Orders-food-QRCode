import http from "@/lib/http";
import {
  CreateTableBodyType,
  TableListResType,
  TableResType,
  UpdateTableBodyType,
} from "@/schemaValidations/table.schema";

const prefix = "/tables";
class TableApiRequest {
  list() {
    return http.get<TableListResType>(prefix);
  }
  add(body: CreateTableBodyType) {
    return http.post<TableResType>(prefix, body);
  }
  detail(number: number) {
    return http.get<TableResType>(`${prefix}/${number}`);
  }
  update(number: number, body: UpdateTableBodyType) {
    return http.put<TableResType>(`${prefix}/${number}`, body);
  }
  delete(number: number) {
    return http.delete<TableListResType>(`${prefix}/${number}`);
  }
}

export const tableApiRequest = new TableApiRequest();
