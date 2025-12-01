import {
  EmailShareButton,
  XIcon,
  TwitterShareButton,
  EmailIcon,
  WhatsappIcon,
  WhatsappShareButton,
  RedditShareButton,
  RedditIcon,
} from "react-share";

const SocialShare = ({ content, image, title }) => {
  const shareUrl = window.location.href;

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
        Share:
      </span>
      <div className="flex items-center space-x-2">
        <TwitterShareButton
          url={shareUrl}
          summary={content}
          title={title}
          className="transition-transform hover:scale-110"
        >
          <XIcon size={32} round className="hover:opacity-80 transition-opacity" />
        </TwitterShareButton>
        <WhatsappShareButton
          url={shareUrl}
          title={title}
          summary={content}
          separator=":: "
          className="transition-transform hover:scale-110"
        >
          <WhatsappIcon size={32} round className="hover:opacity-80 transition-opacity" />
        </WhatsappShareButton>
        <RedditShareButton
          url={shareUrl}
          title={title}
          summary={content}
          source={shareUrl}
          className="transition-transform hover:scale-110"
        >
          <RedditIcon size={32} round className="hover:opacity-80 transition-opacity" />
        </RedditShareButton>
        <EmailShareButton
          url={shareUrl}
          subject={title}
          summary={content}
          body={`Check out this blog post: ${shareUrl}`}
          className="transition-transform hover:scale-110"
        >
          <EmailIcon size={32} round className="hover:opacity-80 transition-opacity" />
        </EmailShareButton>
      </div>
    </div>
  );
};

export default SocialShare;