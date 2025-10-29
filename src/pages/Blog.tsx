import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Blog = () => {
  // Mock blog posts data
  const blogPosts = [
    {
      id: 1,
      slug: "complete-guide-to-macronutrients",
      title: "The Complete Guide to Macronutrients for Fitness Goals",
      excerpt: "Learn how to balance proteins, carbohydrates, and fats to optimize your body composition and performance. This comprehensive guide covers everything from basic calculations to advanced strategies.",
      author: "Dr. Sarah Johnson",
      publishedAt: "2024-09-10",
      tags: ["nutrition", "macros", "fitness"],
      readTime: "8 min read"
    },
    {
      id: 2,
      slug: "progressive-overload-explained",
      title: "Progressive Overload: The Key to Continuous Muscle Growth",
      excerpt: "Discover the science behind progressive overload and how to apply it effectively in your training routine. Avoid plateaus and keep making gains with these proven strategies.",
      author: "Mike Chen",
      publishedAt: "2024-09-08",
      tags: ["training", "muscle-building", "progressive-overload"],
      readTime: "6 min read"
    },
    {
      id: 3,
      slug: "cutting-vs-bulking-when-to-do-what",
      title: "Cutting vs Bulking: When to Do What for Optimal Results",
      excerpt: "Understand the differences between cutting and bulking phases, and learn how to determine which approach is right for your current goals and body composition.",
      author: "Emma Rodriguez",
      publishedAt: "2024-09-05",
      tags: ["cutting", "bulking", "body-composition"],
      readTime: "7 min read"
    },
    {
      id: 4,
      slug: "meal-timing-does-it-matter",
      title: "Meal Timing: Does It Really Matter for Fat Loss?",
      excerpt: "Explore the latest research on meal timing, intermittent fasting, and nutrient timing. Separate fact from fiction in this evidence-based analysis.",
      author: "Dr. Sarah Johnson",
      publishedAt: "2024-09-03",
      tags: ["nutrition", "meal-timing", "fat-loss"],
      readTime: "5 min read"
    },
    {
      id: 5,
      slug: "home-workout-equipment-guide",
      title: "Essential Home Gym Equipment for Every Budget",
      excerpt: "Build an effective home gym without breaking the bank. Our comprehensive guide covers the best equipment for beginners to advanced fitness enthusiasts.",
      author: "Alex Thompson",
      publishedAt: "2024-09-01",
      tags: ["home-gym", "equipment", "budget-fitness"],
      readTime: "10 min read"
    },
    {
      id: 6,
      slug: "sleep-and-recovery-optimization",
      title: "Sleep and Recovery: The Missing Piece in Your Fitness Puzzle",
      excerpt: "Learn why sleep is crucial for muscle growth, fat loss, and performance. Get practical tips to optimize your recovery and see better results from your training.",
      author: "Dr. Michael Brown",
      publishedAt: "2024-08-28",
      tags: ["recovery", "sleep", "performance"],
      readTime: "9 min read"
    }
  ];

  const categories = ["All", "Nutrition", "Training", "Recovery", "Equipment"];
  const selectedCategory = "All";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">FIDEERS Blog</h1>
        <p className="text-muted-foreground">Expert insights on fitness, nutrition, and healthy living</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search articles..." 
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer"
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Featured Article */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <Badge className="bg-primary">Featured</Badge>
            <span className="text-sm text-muted-foreground">{blogPosts[0].readTime}</span>
          </div>
          <h2 className="text-2xl font-bold mb-3">{blogPosts[0].title}</h2>
          <p className="text-muted-foreground mb-4">{blogPosts[0].excerpt}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{blogPosts[0].author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{blogPosts[0].publishedAt}</span>
              </div>
            </div>
            <Button asChild>
              <Link to={`/blog/${blogPosts[0].slug}`}>
                Read More <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Blog Posts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.slice(1).map((post) => (
          <Card key={post.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{post.readTime}</span>
              </div>
              <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <CardDescription className="flex-1 mb-4 line-clamp-3">
                {post.excerpt}
              </CardDescription>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{post.publishedAt}</span>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link to={`/blog/${post.slug}`}>
                    Read Article <ArrowRight className="h-3 w-3 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-8">
        <Button variant="outline" size="lg">
          Load More Articles
        </Button>
      </div>

      {/* Newsletter Signup */}
      <Card className="mt-12">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Get the latest fitness tips, nutrition advice, and workout routines delivered straight to your inbox.
          </p>
          <div className="flex max-w-md mx-auto space-x-2">
            <Input placeholder="Enter your email" type="email" />
            <Button>Subscribe</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            No spam, unsubscribe at any time.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Blog;