interface Resource {
  uuid: string;
  type: 'pdf' | 'link';
  name: string;
  file: string | null;
  link: string;
  thumbnail: string | null;
  created_at: string;
  updated_at: string;
}
interface ResourcesResponse {
  success: boolean;
  message: string;
  count: number;
  data: Resource[];
}
