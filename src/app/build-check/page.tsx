"use client";

import { useState } from "react";

type ErrorItem = {
  line: number;
  message: string;
};

export default function Page() {
  const [code, setCode] = useState(`const name = "Chinmaya";

console.log(name);

const age: number = "25";`);

  const [errors, setErrors] = useState<ErrorItem[]>([]);
  const [output, setOutput] = useState<string[]>([]);

  const runCode = () => {
    const newErrors: ErrorItem[] = [];
    const newOutput: string[] = [];

    const lines = code.split("\n");

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // Simple TypeScript check
      const typeError = line.match(
        /:\s*number\s*=\s*["']/
      );

      if (typeError) {
        newErrors.push({
          line: lineNumber,
          message:
            "Type 'string' is not assignable to type 'number'.",
        });
      }

      // Missing closing bracket
      const openBrackets =
        (line.match(/\(/g) || []).length;

      const closeBrackets =
        (line.match(/\)/g) || []).length;

      if (openBrackets !== closeBrackets) {
        newErrors.push({
          line: lineNumber,
          message: "Missing closing ')'.",
        });
      }
    });

    if (newErrors.length === 0) {
      try {
        const logs: string[] = [];

        const consoleBackup = console.log;

        console.log = (...args) => {
          logs.push(args.map(String).join(" "));
        };

        // Practice only — executes the entered JavaScript
        // eslint-disable-next-line no-new-func
        new Function(code)();

        console.log = consoleBackup;

        newOutput.push(...logs);
      } catch (error) {
        newErrors.push({
          line: 1,
          message:
            error instanceof Error
              ? error.message
              : "Unknown error",
        });
      }
    }

    setErrors(newErrors);
    setOutput(newOutput);
  };

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">
            JavaScript Practice
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Write code and check the result.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Code */}
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-medium">
                Code
              </h2>

              <button
                type="button"
                onClick={runCode}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700"
              >
                Run
              </button>
            </div>

            <textarea
              value={code}
              onChange={(event) =>
                setCode(event.target.value)
              }
              spellCheck={false}
              className="h-[500px] w-full resize-none rounded-lg border border-slate-700 bg-slate-900 p-5 font-mono text-sm leading-6 text-slate-100 outline-none focus:border-blue-500"
            />
          </section>

          {/* Results */}
          <section>
            <h2 className="mb-2 font-medium">
              Results
            </h2>

            {errors.length > 0 ? (
              <div className="space-y-3">
                {errors.map((error, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-red-900 bg-red-950/40 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="rounded bg-red-900 px-2 py-1 text-xs font-medium text-red-200">
                        Error
                      </span>

                      <span className="text-xs text-slate-400">
                        Line {error.line}
                      </span>
                    </div>

                    <p className="mt-3 font-mono text-sm text-red-300">
                      {error.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-green-900 bg-green-950/40 p-5">
                <p className="font-medium text-green-400">
                  ✓ No errors
                </p>

                {output.length > 0 && (
                  <div className="mt-4 border-t border-green-900 pt-4">
                    <p className="mb-2 text-xs uppercase text-slate-500">
                      Output
                    </p>

                    {output.map((item, index) => (
                      <pre
                        key={index}
                        className="font-mono text-sm text-green-300"
                      >
                        {item}
                      </pre>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}