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
import { useSelector } from 'react-redux';



const SocialShare = () => {
    const { blogs } = useSelector(state => state.blog)
    // console.log(blogs);

    const shareUrl = window.location.href; // URL to share
    const shareTitle = blogs.map(blog => blog.title)// Title to share
    const shareContent = blogs.map(blog => blog.content)// Content to share

    return (
        <>
            <TwitterShareButton url={shareUrl} title={shareTitle}>
                <XIcon size={28} round />
            </TwitterShareButton>
            <EmailShareButton url={shareUrl} subject={shareTitle} body={`Check out this blog post: ${shareUrl}`}>
                <EmailIcon size={28} round />
            </EmailShareButton>
            <WhatsappShareButton url={shareUrl} title={shareTitle} separator=":: ">
                <WhatsappIcon size={28} round />
            </WhatsappShareButton>
            <RedditShareButton url={shareUrl} title={shareTitle} summary={shareContent} source={shareUrl}>
                <RedditIcon size={28} round />
            </RedditShareButton>
        </>
    )
};

export default SocialShare;
