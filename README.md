# Solana State App Example
Simple Solana App showcasing a program with multiple State Accounts, with upgradeability between them.

Contains atomic tests to whow that basic program functions work, and also that they still work after upgrading the account.

## Prerequisites

### Node.js
Self-explanatory. I recommend either fnm (the one I'm using) or nvm for managing Node installations.
#### fnm
```
https://github.com/Schniz/fnm
```
#### nvm
```
https://github.com/nvm-sh/nvm
```

### Solana Tool Suite
Great CLI, and very well documented overall
```
https://docs.solana.com/cli/install-solana-cli-tools
```

### Anchor Framework
Awesome framework for interacting w/ Solana. It's still in early stage but it helps a lot.
```
https://project-serum.github.io/anchor/getting-started/introduction.html
```

## Testing
Go into the project root and run:
```
anchor test
```

## Building
Go into the project root and run:
```
anchor build
```
