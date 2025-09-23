import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

export const FeatureCard = ({ feature, hoveredFeature, setHoveredFeature, itemVariants }) => {
  return (
    <motion.div
      key={feature?.id}
      variants={itemVariants}
      className="group relative"
      onMouseEnter={() => setHoveredFeature(feature?.id)}
      onMouseLeave={() => setHoveredFeature(null)}
    >
      <div className="relative bg-card rounded-2xl p-8 h-full border border-border shadow-card hover:shadow-interactive transition-all duration-300 transform hover:-translate-y-2">
        {/* 3D Icon Container */}
        <div className="relative mb-6">
          <motion.div
            animate={{
              rotateY: hoveredFeature === feature?.id ? 360 : 0,
              scale: hoveredFeature === feature?.id ? 1.1 : 1
            }}
            transition={{ duration: 0.6 }}
            className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature?.color} flex items-center justify-center shadow-lg`}
          >
            <Icon 
              name={feature?.icon} 
              size={28} 
              color="white" 
              strokeWidth={2}
            />
          </motion.div>
          
          {/* Glow Effect */}
          <motion.div
            animate={{
              opacity: hoveredFeature === feature?.id ? 0.6 : 0,
              scale: hoveredFeature === feature?.id ? 1.2 : 1
            }}
            transition={{ duration: 0.3 }}
            className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature?.color} blur-xl -z-10`}
          />
        </div>

        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
          {feature?.title}
        </h3>
        
        <p className="text-muted-foreground mb-4 leading-relaxed">
          {feature?.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
            {feature?.stats}
          </span>
          
          <motion.div
            animate={{
              x: hoveredFeature === feature?.id ? 5 : 0
            }}
            transition={{ duration: 0.2 }}
          >
            <Icon 
              name="ArrowRight" 
              size={20} 
              className="text-muted-foreground group-hover:text-primary transition-colors"
            />
          </motion.div>
        </div>

        {/* Hover Border Effect */}
        <motion.div
          animate={{
            opacity: hoveredFeature === feature?.id ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature?.color} opacity-10 -z-10`}
        />
      </div>
    </motion.div>
  );
};
