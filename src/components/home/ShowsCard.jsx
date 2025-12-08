import "react-slideshow-image/dist/styles.css";
import PageHeader from "./PageHeader";
import { toastWarnNotify } from "../../helper/ToastNotify";
import { useSelector } from "react-redux";
import { MdArrowOutward } from "react-icons/md";

const ShowsCard = ({ name, genres, image, summary, url, rating }) => {
  const { currentUser } = useSelector((state) => state.auth);

  const handleReadMore = () => {
    if (!currentUser) {
      toastWarnNotify("Please sign in to continue");
    } else {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-8">
      <PageHeader text="TV Shows" />
      <div className="h-[730px] md:h-[400px] flex flex-col md:flex-row rounded-2xl shadow-lg overflow-hidden p-4 bg-white">
        <div className="w-full grid grid-cols-12">
          <div className="col-span-12 md:col-span-6 flex flex-col justify-between p-6">
            <div>
              <p className="text-xs font-bold text-gray-500 mb-2">
                {genres.slice(0, 3).join(" • ")}
              </p>
              <h5 className="font-bold mt-2 mb-4 text-gray-900 text-xl">
                {name}
              </h5>
              <p className="mb-6 line-clamp-4 md:line-clamp-6 overflow-hidden text-ellipsis text-gray-700">
                {summary}
              </p>
              <p className="text-base font-bold text-gray-900">
                Rating: {rating.average}
              </p>
            </div>
            <div className="ml-auto">
              <button
                onClick={handleReadMore}
                className="flex items-center gap-2 cursor-pointer font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                Read More <MdArrowOutward className="mt-0.5" />
              </button>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6 flex items-center justify-center">
            <img
              src={image?.original || image?.medium}
              alt="tv show"
              className="w-full h-[374px] object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowsCard;
