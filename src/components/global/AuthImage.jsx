const AuthImage = ({ image }) => {
  return (
    <div className="w-full flex items-center justify-center animate-fade-in">
      <div className="relative w-full max-w-lg">
        <img
          src={image}
          alt="Authentication illustration"
          className="w-full h-auto rounded-2xl shadow-2xl object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-500/20 to-transparent rounded-2xl" />
      </div>
    </div>
  );
};

export default AuthImage;