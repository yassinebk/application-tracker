export interface Application {
  id: string;
  link: string;
  company: string;
  role: string;
  type: string;
  location: string;
  country: string;
  status: string;
  applicationDate: string;
  notes: string;
}

export const mapStatusToBadge = (status: string) => {
  switch (status) {
    case "TO_APPLY":
      return "bg-gray-200 text-gray-900";
    case "PENDING":
      return "bg-yellow-200 text-gray-900";
    case "CANCELED":
      return "bg-red-900 text-red-800";
    case "IN_INTERVIEWS":
      return "bg-blue-200 text-blue-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

export const APPLICATION_STATUSES = [
  "TO_APPLY",
  "PENDING",
  "CANCELED",
  "REFUSED",
  "IN_INTERVIEWS",
];

export const APPLICATION_TYPES = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
];
