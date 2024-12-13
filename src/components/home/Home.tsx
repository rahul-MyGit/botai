import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { auth } from '@/lib/auth';
import MeetLinkModal from '../MeetLinkModal';

const Home: React.FC = async () => {
  const session = await auth()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Transform Your Google Meet Experience
              </h1>
              <p className="text-lg md:text-xl max-w-xl mx-auto text-white/90">
                Join, record, and get insights from your Google Meet sessions with AI-powered precision and ease.
              </p>
              <div className="pt-4">
                <MeetLinkModal session={session}/>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-teal-800">
              Powerful Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Automatic Join",
                  description: "Seamlessly paste your Google Meet URL and let our intelligent bot join the session automatically.",
                  icon: "🤖"
                },
                {
                  title: "Session Recording",
                  description: "Capture every moment with high-quality, automatic meeting recordings.",
                  icon: "🎥"
                },
                {
                  title: "Smart Summaries",
                  description: "Receive AI-generated concise summaries that capture key discussion points.",
                  icon: "📝"
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center"
                >
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-4 text-teal-600">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-teal-50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-teal-800">
              How It Works
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                {[
                  "Paste your Google Meet URL into MeetBot",
                  "Our AI bot joins the meeting and starts recording",
                  "Receive a detailed summary and transcript after the meeting",
                  "Access your recordings and insights anytime, anywhere"
                ].map((step, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-4 bg-white p-6 rounded-lg shadow-md"
                  >
                    <div className="text-2xl font-bold text-teal-600 w-12 h-12 flex items-center justify-center rounded-full bg-teal-100">
                      {index + 1}
                    </div>
                    <p className="text-lg text-gray-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6 max-w-2xl mx-auto">
              Ready to Revolutionize Your Meeting Experience?
            </h2>
            <p className="text-xl mb-10 max-w-xl mx-auto text-white/90">
              Join thousands of professionals leveraging AI to make meetings more productive and insightful.
            </p>

            <MeetLinkModal session={session}/>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;