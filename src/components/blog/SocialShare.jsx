import {
    EmailShareButton,
    XIcon,
    TwitterShareButton,
    EmailIcon,
    WhatsappIcon,
    WhatsappShareButton,
    RedditShareButton,
    RedditIcon,
} from 'react-share';



const SocialShare = ({ content, image, title }) => {


    const shareUrl = window.location.href; // URL to share

    return (
        <>
            <TwitterShareButton url={shareUrl} summary={content} title={title}>
                <XIcon size={28} round />
            </TwitterShareButton>
            <WhatsappShareButton url={shareUrl} title={title} summary={content} separator=":: ">
                <WhatsappIcon size={28} round />
            </WhatsappShareButton>
            <RedditShareButton url={shareUrl} title={title} summary={content} source={shareUrl}>
                <RedditIcon size={28} round />
            </RedditShareButton>
            <EmailShareButton url={shareUrl} subject={title} summary={content} body={`Check out this blog post: ${shareUrl}`}>
                <EmailIcon size={28} round />
            </EmailShareButton>
        </>
    )
};

export default SocialShare;
