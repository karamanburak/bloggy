import "react-slideshow-image/dist/styles.css";
import PageHeader from "./PageHeader";
import { MdArrowOutward } from "react-icons/md";

const defaultImage =
  "https://images.unsplash.com/photo-1581905764498-f1b60bae941a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80";

const BooksCard = ({
  amazon_product_url,
  author,
  book_image,
  description,
  title,
}) => {
  const handleReadMore = () => {
    window.open(amazon_product_url, "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-8">
      <PageHeader text="Books" />
      <div className="flex flex-col md:flex-row rounded-2xl shadow-xl overflow-hidden p-4 bg-gray-50 border border-gray-200 relative transition-transform duration-300 hover:shadow-2xl hover:scale-[1.01]">
        <div className="w-full md:w-1/2 grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6 flex items-center justify-center p-4">
            <img
              src={book_image || defaultImage}
              alt={`image for ${title}`}
              className="w-full h-[350px] rounded-xl shadow-lg object-cover"
            />
          </div>
          <div className="col-span-12 md:col-span-6 flex flex-col justify-between p-6">
            <div>
              <h5 className="font-bold mt-2 mb-2 text-gray-900 text-xl">
                {title}
              </h5>
              <h6 className="mb-4 text-gray-700 text-lg">
                {author}
              </h6>
              <p className="mb-6 line-clamp-4 md:line-clamp-6 overflow-hidden text-ellipsis text-gray-600">
                {description}
              </p>
            </div>
            <button
              onClick={handleReadMore}
              className="self-end cursor-pointer text-primary-600 hover:text-primary-700 transition-colors flex items-center"
            >
              Read More <MdArrowOutward className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooksCard;
