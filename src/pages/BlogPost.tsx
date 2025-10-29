import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, Clock, ArrowLeft, Share2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const BlogPost = () => {
  const { slug } = useParams();

  // Mock blog post data - would normally fetch based on slug
  const post = {
    title: "The Complete Guide to Macronutrients for Fitness Goals",
    excerpt: "Learn how to balance proteins, carbohydrates, and fats to optimize your body composition and performance.",
    content: `
# Introduction

Understanding macronutrients is fundamental to achieving your fitness goals, whether you're looking to lose fat, build muscle, or improve athletic performance. This comprehensive guide will break down everything you need to know about proteins, carbohydrates, and fats.

## What Are Macronutrients?

Macronutrients are the three main components of food that provide energy and support various bodily functions:

### 1. Protein (4 calories per gram)

Protein is essential for:
- Muscle growth and repair
- Immune function
- Hormone production
- Maintaining lean body mass during weight loss

**Best sources:** Lean meats, fish, eggs, dairy products, legumes, and plant-based proteins like tofu and tempeh.

**Recommended intake:** 1.6-2.2 grams per kilogram of body weight for active individuals.

### 2. Carbohydrates (4 calories per gram)

Carbohydrates serve as:
- Primary energy source for high-intensity exercise
- Fuel for the brain and nervous system
- Muscle glycogen storage
- Recovery after workouts

**Best sources:** Whole grains, fruits, vegetables, legumes, and starchy vegetables like sweet potatoes.

**Recommended intake:** 45-65% of total daily calories, with higher amounts for endurance athletes.

### 3. Fats (9 calories per gram)

Fats are crucial for:
- Hormone production (especially testosterone and estrogen)
- Absorption of fat-soluble vitamins (A, D, E, K)
- Cell membrane structure
- Long-term energy storage

**Best sources:** Nuts, seeds, avocados, olive oil, fatty fish, and grass-fed meats.

**Recommended intake:** 20-35% of total daily calories.

## Setting Your Macronutrient Ratios

The optimal macro ratio depends on your specific goals:

### For Fat Loss
- Protein: 25-30%
- Carbohydrates: 35-45%
- Fat: 25-30%

### For Muscle Building
- Protein: 20-25%
- Carbohydrates: 45-55%
- Fat: 20-30%

### For Athletic Performance
- Protein: 15-20%
- Carbohydrates: 55-65%
- Fat: 20-25%

## Practical Implementation

### Step 1: Calculate Your Daily Calories
Use your Total Daily Energy Expenditure (TDEE) as a starting point and adjust based on your goals.

### Step 2: Set Your Protein Target
Start with 1.8g per kg of body weight and adjust based on your activity level and goals.

### Step 3: Determine Fat Intake
Aim for 25-30% of total calories from healthy fat sources.

### Step 4: Fill Remaining Calories with Carbs
Use the remaining calories for carbohydrates, focusing on nutrient-dense sources.

## Common Mistakes to Avoid

1. **Too little protein:** This can lead to muscle loss and poor recovery.
2. **Fear of carbohydrates:** Carbs are essential for performance and recovery.
3. **Too little fat:** Can negatively impact hormone production.
4. **Perfectionism:** Aim for consistency over perfection.

## Conclusion

Mastering macronutrients is a powerful tool for achieving your fitness goals. Start with the general guidelines provided, track your intake for a few weeks, and adjust based on your progress and how you feel.

Remember, the best nutrition plan is one you can stick to long-term. Focus on whole, nutrient-dense foods and don't be afraid to experiment to find what works best for your body and lifestyle.
    `,
    author: "Dr. Sarah Johnson",
    publishedAt: "2024-09-10",
    tags: ["nutrition", "macros", "fitness"],
    readTime: "8 min read"
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/blog">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>
      </Button>

      <article className="max-w-4xl mx-auto">
        {/* Article Header */}
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">{post.title}</h1>
          
          <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{post.publishedAt}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
            
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </header>

        <Separator className="mb-8" />

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-line text-foreground leading-relaxed">
            {post.content.split('\n').map((paragraph, index) => {
              if (paragraph.startsWith('# ')) {
                return (
                  <h1 key={index} className="text-3xl font-bold mt-8 mb-4 text-foreground">
                    {paragraph.substring(2)}
                  </h1>
                );
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-2xl font-bold mt-6 mb-3 text-foreground">
                    {paragraph.substring(3)}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-xl font-semibold mt-4 mb-2 text-foreground">
                    {paragraph.substring(4)}
                  </h3>
                );
              }
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                  <p key={index} className="font-semibold mt-3 mb-2 text-foreground">
                    {paragraph.slice(2, -2)}
                  </p>
                );
              }
              if (paragraph.trim() === '') {
                return <div key={index} className="h-4" />;
              }
              return (
                <p key={index} className="mb-4 text-foreground">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>

        <Separator className="my-8" />

        {/* Author Bio */}
        <Card>
          <CardHeader>
            <CardTitle>About the Author</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">{post.author}</h4>
                <p className="text-muted-foreground">
                  Dr. Sarah Johnson is a certified nutritionist and fitness expert with over 10 years of experience 
                  helping clients achieve their health and fitness goals. She holds a PhD in Exercise Science and 
                  is passionate about evidence-based nutrition and training strategies.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="mt-8">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Apply These Principles?</h3>
            <p className="text-muted-foreground mb-6">
              Join FIDEERS and get personalized macro calculations and meal plans tailored to your goals.
            </p>
            <Button asChild size="lg">
              <Link to="/signup">
                Start Your Journey
              </Link>
            </Button>
          </CardContent>
        </Card>
      </article>
    </div>
  );
};

export default BlogPost;