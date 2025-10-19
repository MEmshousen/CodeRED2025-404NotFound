"use client";

export default function Student() {
  console.log("Student page accessed");

  function test() {
    console.log("Button clicked");
  }

  return (
    <div>
      <h1>Test Page</h1>
      <p>This is a test page in the application.</p>
      <button onClick={test}>Boop</button>
    </div>
  );
}
