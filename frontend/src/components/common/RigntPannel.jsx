import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { useQuery } from "@tanstack/react-query";
import useFollow from "../../Hooks/useFollow";
import LoadingSpinner from "./LoadingSpinner";

const RightPanel = () => {
  const { isLoading, data: suggestedUser } = useQuery({
    queryKey: ["suggestedUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/suggested");
        const data = res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const { follow, isPending } = useFollow();

  if (suggestedUser?.length === 0) return <div className="md:w-64 w-0"></div>;

  return (
    <div className="hidden lg:block my-3 mx-2">
      <div className="bg-gray-800 p-4 rounded-lg sticky top-2 border border-gray-700 ">
        <p className="font-semibold text-white mb-4">Who to follow</p>
        <div className="flex flex-col gap-4">
          {/* Skeleton Loading */}
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}

          {/* User List */}
          {!isLoading &&
            suggestedUser?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4 hover:bg-gray-700 p-2 rounded-lg transition duration-300"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={user.profileImg || "/avatar-placeholder.png"}
                        alt="User Avatar"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-white truncate w-28">
                      {user.fullName}
                    </span>
                    <span className="text-sm text-gray-400">
                      @{user.username}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    className="btn bg-blue-500 text-white hover:bg-blue-400 rounded-full btn-sm transition duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      follow(user._id);
                    }}
                  >
                    {isPending ? <LoadingSpinner size="sm" /> : "Follow"}
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
