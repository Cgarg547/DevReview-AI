import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

const codeSnippet = `export async function getToken() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    throw { message: "User not found" };
  }
  // Get the OAuth access token for the user
  const provider = "github";
  const client = await clerkClient();
  const clerkResponse = await client.users.getUserOauthAccessToken(
    userId,
    provider
  );

  const accessToken = clerkResponse.data[0] || "";
  if (!accessToken) {
    return { message: "Access token not found", status: 401 };
  }
  return { token: accessToken.token };
}`;

const AiComment: React.FC<{
  children: React.ReactNode;
  top: string;
  right?: string;
  left?: string;
  delay: string;
}> = ({ children, top, right, left, delay }) => {
  const positionStyle = right ? { right } : { left };
  return (
    <div
      className="absolute p-2 bg-gray-700 border border-sky-500 rounded-md text-xs text-gray-300 shadow-lg animate-fadeIn opacity-0"
      style={{
        top,
        ...positionStyle,
        animationDelay: delay,
      }}
    >
      {children}
    </div>
  );
};

export const HeroAnimation: React.FC = () => {
  return (
    <div className="heroanimation">
      {/* Window Header */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-3 h-3 bg-red-500 rounded-full" />
        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
        <div className="w-3 h-3 bg-green-500 rounded-full" />
      </div>

      {/* Code */}
      <div className="relative">
        <SyntaxHighlighter
          language="javascript"
          style={okaidia}
          showLineNumbers
          customStyle={{
            margin: 0,
            padding: "1rem",
            backgroundColor: "transparent",
            fontSize: "0.8rem",
          }}
          codeTagProps={{
            className: "blinking-cursor",
            style: {
              fontFamily: `'Fira Code', monospace`,
            },
          }}
        >
          {codeSnippet}
        </SyntaxHighlighter>

        {/* AI Comments */}
        <AiComment top="2.8rem" left="105%" delay="0.5s">
          💡 Use `===` for strict equality.
        </AiComment>
        <AiComment top="7rem" left="105%" delay="1s">
          ✅ Good initialization.
        </AiComment>
        <AiComment top="8.5rem" left="105%" delay="1.5s">
          ✨ Clean loop structure.
        </AiComment>
      </div>
    </div>
  );
};
