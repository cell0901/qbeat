import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Users, Music, Vote, ArrowRight } from "lucide-react"
import { Appbar } from "./components/AppBar"
import { Redirect } from "./components/Redirect"
export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-gray-200">
        {/* Header Section */}
      <Redirect/>
      <Appbar/>

      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-500/10" />
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <Badge className="mb-6 bg-purple-500/20 text-purple-400 border-purple-500/30">
            Fan-Driven Music Streaming
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-400 to-blue-800 bg-clip-text text-transparent drop-shadow-lg">
            MUSAAS
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            The first music streaming platform where creators and fans collaborate in real-time. Let your audience vote
            on what plays next during your streams.
          </p>
          <Button size="lg" className="bg-purple-500 hover:bg-purple-600 text-black font-semibold px-8 py-4">
            Join as Creator
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">

          </div>
        </div>
      </header>

      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Stream live, let fans vote, create together</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-gray-800 border-gray-700 hover:border-purple-500/50 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Play className="h-8 w-8 text-blue-700" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Stream Live</h3>
                <p className="text-gray-400">Start your live music stream</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 hover:border-purple-500/50 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Vote className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Fans Vote</h3>
                <p className="text-gray-400">Audience chooses what plays next</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 hover:border-purple-500/50 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-blue-700" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Create Together</h3>
                <p className="text-gray-400">Build stronger fan connections</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/10 via-purple-500/10 to-blue-900/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Music?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join the revolution where fans and creators collaborate to create unforgettable musical experiences
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-purple-500 hover:bg-purple-600 text-black font-semibold px-8 py-4">
              Start Streaming
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-gray-200 px-8 py-4 bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 border-t border-gray-700 py-8">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-2 text-purple-400">StreamChoice</h3>
          <p className="text-gray-400 mb-4">Empowering creators and fans through interactive music streaming.</p>
          <p className="text-sm text-gray-400">&copy; 2024 StreamChoice. All rights reserved.</p>
        </div>
      </footer>
</div>
  )
}
