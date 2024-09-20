import { Skeleton } from "./ui/skeleton";

const Loading = () => {
  return <div className="flex flex-col justify-center items-center h-screen">
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[50vw] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[50vw]" />
        <Skeleton className="h-4 w-[50vw]" />
      </div>
    </div>
  </div>;
};


export default Loading