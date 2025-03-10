import React from "react";
import { Helmet } from "react-helmet";

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Cerebro - Your Mental Health Companion",
  description:
    "Cerebro is a mental health app that provides articles, Chatbots, exercises, and self-counseling resources to help you take care of your mental health.",
  keywords:
    "mental health, app, articles, Chatbots, exercises, self-counseling",
};

export default Meta;
