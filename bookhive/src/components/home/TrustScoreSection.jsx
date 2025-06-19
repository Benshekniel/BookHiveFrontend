import React from 'react';
import { Shield, Star, Award, Hexagon } from 'lucide-react';

const TrustScoreSection = () => {
  const hexagonStyle = {
    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
  };

  return (
    <div className="py-16" style={{ backgroundColor: '#1E3A8A', color: '#FFFFFF' }}> {/* bg-secondary text-white */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
            The BookHive TrustScore System
          </h2>
          <p className="mt-3 max-w-2xl mx-auto" style={{ color: '#3B82F6' }}> {/* text-blue-100 */}
            Our unique rating system ensures safety and reliability within our community
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FFC107' }}> {/* bg-primary */}
                  <Shield className="text-secondary" size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>Verified Users</h3>
                <p style={{ color: '#3B82F6' }}>
                  All users are verified through multiple authentication methods to ensure 
                  a safe and trustworthy community.
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FFC107' }}>
                  <Star className="text-secondary" size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>User Reviews</h3>
                <p style={{ color: '#3B82F6' }}>
                  After each transaction, users can rate and review each other, 
                  helping to build a reliable TrustScore.
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FFC107' }}>
                  <Award className="text-secondary" size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>Achievement Badges</h3>
                <p style={{ color: '#3B82F6' }}>
                  Earn badges for positive behaviors such as on-time returns, 
                  book donations, and active participation in the community.
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full" style={{ ...hexagonStyle, backgroundColor: '#FFC107/20' }}></div> {/* hexagon bg-primary/20 */}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center transition-transform duration-500 hover:scale-105">
                  <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ backgroundColor: '#FFC107' }}> {/* bg-primary */}
                    <Hexagon className="text-secondary" size={64} />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>TrustScore</h3>
                  <p className="mt-2 max-w-xs mx-auto" style={{ color: '#3B82F6' }}>
                    Higher TrustScores unlock premium features and increase your chances of 
                    successful book transactions.
                  </p>
                  <div className="mt-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full" style={{ backgroundColor: '#FFC107', color: '#1E3A8A' }}> {/* bg-primary text-secondary */}
                      <Star size={16} className="mr-1" />
                      <span>4.8</span>
                    </div>
                    <span className="ml-2" style={{ color: '#3B82F6' }}>Excellent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustScoreSection;