import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-fitness.jpg";
import { Target, TrendingUp, Users, Zap } from "lucide-react";

const Home = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Science of Sustainable Weight Loss",
      excerpt: "Discover evidence-based strategies for losing weight and keeping it off long-term.",
      slug: "science-sustainable-weight-loss"
    },
    {
      id: 2,
      title: "Building Muscle: A Beginner's Complete Guide",
      excerpt: "Everything you need to know about strength training and muscle building for beginners.",
      slug: "building-muscle-beginners-guide"
    },
    {
      id: 3,
      title: "Nutrition Timing: Does When You Eat Matter?",
      excerpt: "Exploring the research on meal timing and its impact on health and fitness goals.",
      slug: "nutrition-timing-research"
    }
  ];

  const features = [
    {
      icon: Target,
      title: "Personalized Plans",
      description: "Custom diet and workout plans based on your goals, preferences, and lifestyle."
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Visualize your progress with detailed analytics and pace indicators."
    },
    {
      icon: Zap,
      title: "Science-Based",
      description: "All recommendations backed by peer-reviewed research and proven methodologies."
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with like-minded individuals on their fitness journey."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-primary-foreground py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Person exercising with dumbbells" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Transform Your Health with <span className="text-secondary">FIDEERS</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Personalized fitness and nutrition plans that adapt to your lifestyle. 
              Start your journey to a healthier, stronger you today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90">
                <Link to="/signup">Try it for Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/blog">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose FIDEERS?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform combines cutting-edge science with personalized guidance 
              to help you achieve lasting results.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gradient-card border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Health Insights</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay informed with evidence-based articles on fitness, nutrition, and wellness.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {blogPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {post.excerpt}
                  </CardDescription>
                  <Button variant="outline" asChild>
                    <Link to={`/blog/${post.slug}`}>Read More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button asChild>
              <Link to="/blog">View All Articles</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Transformation?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of users who have already transformed their health with FIDEERS. 
            Get started with your personalized plan today.
          </p>
          <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90">
            <Link to="/signup">Get Started Free</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;