import { useQuery } from "@tanstack/react-query";
import {  AUTH_REQUEST } from "../axiosConfig";
import { CRUD_SERVICE } from "../Url";

function useStudent() {
  const { isLoading, data: students } = useQuery({
    queryKey: ["students"],
    queryFn: async function () {
      const res = await AUTH_REQUEST.get(`${CRUD_SERVICE}/api/v1/students`);
      return res.data.data;
    },
    retry: 1,
  });

  return { isLoading, students };
}

export default useStudent;
