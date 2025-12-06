import { useEffect } from "react";
import Footer from "../components/home/Footer";
import PageHero from "../components/home/PageHero";
import useCategoryCall from "../hooks/useCategoryCall";
import Avatar from "../components/global/Avatar";
import { HiSparkles, HiUserGroup, HiLightBulb, HiBookOpen } from "react-icons/hi";
import { FaLinkedin, FaSquareGithub, FaInstagram, FaTwitter } from "react-icons/fa6";

const teamMembers = [
  {
    name: "Hu Bo",
    position: "Founder & Co-CEO",
    bio: "Acclaimed filmmaker known for complex narratives and innovative storytelling. Founded Bloggy to bring cinematic depth to digital content creation.",
    expertise: ["Storytelling", "Narrative", "Innovation"],
    experience: "25+ years",
    social: {
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    name: "Béla Tarr",
    position: "Co-CEO",
    bio: "Legendary director and film historian. Brings decades of cinematic expertise to shape our editorial vision and content strategy.",
    expertise: ["Cinema", "History", "Direction"],
    experience: "50+ years",
    social: {
      linkedin: "#",
      instagram: "#",
    },
  },
  {
    name: "Nuri Bilge Ceylan",
    position: "Senior Editor",
    bio: "Master storyteller known for creating universally appealing narratives. Ensures our content resonates with audiences worldwide.",
    expertise: ["Storytelling", "Production", "Editing"],
    experience: "45+ years",
    social: {
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    name: "Gaspar Noé",
    position: "Content Editor",
    bio: "Award-winning director with a unique voice in storytelling. Brings bold perspectives and creative flair to our editorial content.",
    expertise: ["Writing", "Dialogue", "Genre"],
    experience: "30+ years",
    social: {
      linkedin: "#",
      instagram: "#",
    },
  },
  {
    name: "Martin Scorsese",
    position: "Creative Director",
    bio: "Acclaimed writer-director known for authentic character-driven stories. Shapes our creative direction with fresh, modern perspectives.",
    expertise: ["Writing", "Direction", "Character"],
    experience: "15+ years",
    social: {
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    name: "Francis Ford Coppola",
    position: "Visual Editor",
    bio: "Visionary filmmaker specializing in atmospheric storytelling. Creates visually stunning and thought-provoking content experiences.",
    expertise: ["Visual", "Atmosphere", "Cinematography"],
    experience: "20+ years",
    social: {
      linkedin: "#",
      instagram: "#",
    },
  },
  {
    name: "Guillermo del Toro",
    position: "International Editor",
    bio: "Oscar-winning director known for genre-bending narratives. Brings global perspectives and innovative storytelling techniques.",
    expertise: ["Genre", "International", "Innovation"],
    experience: "25+ years",
    social: {
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    name: "Christopher Nolan",
    position: "Style Editor",
    bio: "Acclaimed director known for distinctive visual style and intimate storytelling. Curates our aesthetic and editorial voice.",
    expertise: ["Style", "Aesthetics", "Visual"],
    experience: "20+ years",
    social: {
      linkedin: "#",
      instagram: "#",
    },
  },
];

const About = () => {
  const { getCategory } = useCategoryCall();

  useEffect(() => {
    getCategory("categories");
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <PageHero
        title="Unleash Your Creativity"
        description="Dream, Explore, Create"
        showHomeButton={true}
        padding="py-24 md:py-32"
        icon={HiSparkles}
      />

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* About Content */}
          <div className="card p-8 lg:p-12 mb-12 animate-slide-up">
            <div className="flex items-center space-x-3 mb-8">
              <HiSparkles className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                About Us
              </h2>
            </div>

            <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p className="text-lg">
                At Bloggy, we are passionate about sharing stories, insights,
                and knowledge across a variety of topics. Our mission is to
                create a platform where readers can find engaging content that
                informs, inspires, and entertains.
              </p>

              <div className="mt-8">
                <div className="flex items-center space-x-3 mb-4">
                  <HiUserGroup className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Who We Are
                  </h3>
                </div>
                <p className="text-lg">
                  We are a diverse team of writers, editors, and enthusiasts who
                  come together to bring you fresh perspectives on topics that
                  matter. From technology and lifestyle to travel and personal
                  development, our team is dedicated to delivering high-quality
                  articles that resonate with our readers.
                </p>
              </div>

              <div className="mt-8">
                <div className="flex items-center space-x-3 mb-4">
                  <HiLightBulb className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Our Mission
                  </h3>
                </div>
                <p className="text-lg">
                  Our mission is to connect people through the power of
                  storytelling. We believe that everyone has a story to tell and
                  valuable insights to share. By providing a space for these
                  stories, we hope to foster a community of curious and
                  thoughtful readers.
                </p>
              </div>

              <div className="mt-8">
                <div className="flex items-center space-x-3 mb-4">
                  <HiBookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    What We Offer
                  </h3>
                </div>
                <ul className="space-y-3 text-lg">
                  <li className="flex items-start space-x-3">
                    <span className="text-primary-600 dark:text-primary-400 font-bold mt-1">
                      •
                    </span>
                    <span>
                      <strong>In-Depth Articles:</strong> Comprehensive and
                      well-researched articles that delve into various subjects.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-primary-600 dark:text-primary-400 font-bold mt-1">
                      •
                    </span>
                    <span>
                      <strong>Personal Stories:</strong> Real-life experiences
                      and narratives that inspire and motivate.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-primary-600 dark:text-primary-400 font-bold mt-1">
                      •
                    </span>
                    <span>
                      <strong>Expert Insights:</strong> Tips and advice from
                      industry experts and thought leaders.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-primary-600 dark:text-primary-400 font-bold mt-1">
                      •
                    </span>
                    <span>
                      <strong>Engaging Content:</strong> Interactive and
                      multimedia content to enhance your reading experience.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 p-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl border-l-4 border-primary-500">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Join Our Community
                </h3>
                <p className="text-lg">
                  We invite you to join our growing community of readers and
                  contributors. Follow us on social media, subscribe to our
                  newsletter, and feel free to reach out with your thoughts and
                  feedback. Your voice is important to us, and we are always
                  eager to hear from our readers.
                </p>
              </div>

              <div className="mt-8 text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Thank you for being a part of Bloggy. Together, let's dream,
                  explore, and create.
                </p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="card p-8 lg:p-12 animate-slide-up">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Our Team
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Meet the talented individuals who bring Bloggy to life. Our diverse team of writers, editors, designers, and developers work together to create exceptional content.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group"
                >
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="relative mb-4 group-hover:scale-105 transition-transform duration-300">
                      <div className="relative">
                        <Avatar 
                          name={member.name} 
                          size={96}
                          className="border-4 border-primary-500 shadow-lg"
                        />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {member.name}
                    </h4>
                    <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-2">
                      {member.position}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      {member.experience} experience
                    </p>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 text-center">
                    {member.bio}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {member.expertise.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {member.social.linkedin && (
                      <a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <FaLinkedin className="w-5 h-5" />
                      </a>
                    )}
                    {member.social.twitter && (
                      <a
                        href={member.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        aria-label={`${member.name} Twitter`}
                      >
                        <FaTwitter className="w-5 h-5" />
                      </a>
                    )}
                    {member.social.github && (
                      <a
                        href={member.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                        aria-label={`${member.name} GitHub`}
                      >
                        <FaSquareGithub className="w-5 h-5" />
                      </a>
                    )}
                    {member.social.instagram && (
                      <a
                        href={member.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                        aria-label={`${member.name} Instagram`}
                      >
                        <FaInstagram className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;