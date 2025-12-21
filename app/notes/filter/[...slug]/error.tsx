"use client";

interface ErrorProps {
  error: Error;
}

function Error({ error }: ErrorProps) {
  return (
    <div>
      <p>Could not fetch filtered notes. {error.message}</p>
    </div>
  );
}

export default Error;
