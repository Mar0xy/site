import Blog from "../components/blog";
import { getMdContentById } from "../lib/ssg";

export default function Privacy(props) {
  return (
    <Blog author="Lawrence" date="2023-04-04" title="Privacy Policy" noReply>
      <div
        dangerouslySetInnerHTML={{
          __html: props.htmlStringContent,
        }}
      />
    </Blog>
  );
}

export const getStaticProps = async () => {
  const mdData = await getMdContentById("privacy", process.cwd());
  return {
    props: mdData,
  };
};
