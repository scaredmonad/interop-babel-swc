# interop-babel-swc

**interop-babel-swc** ensures interoperability between ASTs generated/consumed by both Babel and SWC for acheiving faster compilation.

## Motivation

With the current trend of native build tools paving way into our everyday toolchains like Next.js, a rather persistant issue is losing out on Babel plugins for critical transformation.

Meta-build tools like Create React App and Gatsby have a hardline dependency on Babel, which is notorious for ridiculously-slow compile times.

With that being highlighted, interop-babel-swc delegates parsing and code generation to SWC. Ultimately, Babel-based setups should build faster, which places the focus on the accuracy of interoperability.
