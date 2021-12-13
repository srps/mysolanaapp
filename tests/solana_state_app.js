const assert = require("assert");
const anchor = require("@project-serum/anchor");
const idl = require("../target/idl/solana_state_app.json");

const { SystemProgram } = anchor.web3;

describe("solana_state_app", () => {
  console.log("🚀 Starting test...");

  const provider = anchor.Provider.env();

  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  it("Is initialized!", async () => {

    const program = anchor.workspace.SolanaStateApp;
    
    console.log("🔑 Generating keys...");
    const StateAccount = anchor.web3.Keypair.generate();

    const tx = await program.rpc.create({
      accounts: {
        stateAccount: StateAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [StateAccount],
    });

    console.log("Your transaction signature", tx);

    let account = await program.account.stateAccount.fetch(
      StateAccount.publicKey
    );

    switch (
      Object.keys(account.current).filter((key) => key.endsWith("State"))[0]
    ) {
      case "firstState":
        console.log("🔑 Account should be initialized with firstState.");
        assert.ok(account.current.firstState);
        assert.strictEqual(account.current.firstState.count, 0);
        break;
      case "secondState":
        throw new Error("🔑 Account should not be initialized with secondState.");
      default:
        throw new Error("Unknown state");
    }

    console.log("🚀 Test complete!");
  });

  it("Can increment!", async () => {
  
    const program = anchor.workspace.SolanaStateApp;

    console.log("🔑 Generating keys...");
    const StateAccount = anchor.web3.Keypair.generate();

    const tx = await program.rpc.create({
      accounts: {
        stateAccount: StateAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [StateAccount],
    });

    console.log("Your transaction signature", tx);

    let account = await program.account.stateAccount.fetch(
      StateAccount.publicKey
    );

    switch (
      Object.keys(account.current).filter((key) => key.endsWith("State"))[0]
    ) {
      case "firstState":
        console.log("🔑 Account should be initialized with firstState.");
        assert.ok(account.current.firstState);
        assert.strictEqual(account.current.firstState.count, 0);
        break;
      case "secondState":
        throw new Error("🔑 Account should not be initialized with secondState.");
      default:
        throw new Error("Unknown state");
    }

    let initialCount = account.current.firstState.count;

    console.log("🔑 Incrementing...");
    const result = await program.rpc.increment({
      accounts: {
        stateAccount: StateAccount.publicKey,
      },
    });

    account = await program.account.stateAccount.fetch(StateAccount.publicKey);

    console.log(`Account firstState count should be ${initialCount + 1}.`);
    console.log(
      `Account firstState count: ${account.current.firstState.count}`
    );
    assert.strictEqual(account.current.firstState.count, initialCount + 1);

    console.log("🚀 Test complete!");
  });

  it("Cannot decrement initial state!", async () => {
    
    const program = anchor.workspace.SolanaStateApp;

    console.log("🔑 Generating keys...");
    const StateAccount = anchor.web3.Keypair.generate();

    const tx = await program.rpc.create({
      accounts: {
        stateAccount: StateAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [StateAccount],
    });

    console.log("Your transaction signature", tx);

    let account = await program.account.stateAccount.fetch(
      StateAccount.publicKey
    );

    switch (
      Object.keys(account.current).filter((key) => key.endsWith("State"))[0]
    ) {
      case "firstState":
        console.log("🔑 Account should be initialized with firstState.");
        assert.ok(account.current.firstState);
        assert.strictEqual(account.current.firstState.count, 0);
        break;
      case "secondState":
        throw new Error("🔑 Account should not be initialized with secondState.");
        break;
      default:
        throw new Error("Unknown state");
    }

    console.log("🔑 Decrementing...");
    try {
      const result = await program.rpc.decrement({
        accounts: {
          stateAccount: StateAccount.publicKey,
        },
      });

      account = await program.account.stateAccount.fetch(StateAccount.publicKey);

      throw new Error("🔑 Should not be able to decrement initial state.");

    } catch (err) {
      console.log("🔑 Error correctly thrown - checking if it exists in IDL.");
      assert.ok(idl.errors.find(error => error.code === err.code));
    }

    console.log("🚀 Test complete!");
  });

  it("Initialize, increment, upgrade", async () => {

    const program = anchor.workspace.SolanaStateApp;

    console.log("🔑 Generating keys...");
    const StateAccount = anchor.web3.Keypair.generate();

    const tx = await program.rpc.create({
      accounts: {
        stateAccount: StateAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [StateAccount],
    });

    console.log("Your transaction signature", tx);

    let account = await program.account.stateAccount.fetch(
      StateAccount.publicKey
    );

    switch (
      Object.keys(account.current).filter((key) => key.endsWith("State"))[0]
    ) {
      case "firstState":
        console.log("🔑 Account should be initialized with firstState.");
        assert.ok(account.current.firstState);
        assert.strictEqual(account.current.firstState.count, 0);
        break;
      case "secondState":
        throw new Error("🔑 Account should not be initialized with secondState.");
      default:
        throw new Error("Unknown state");
    }

    let initialCount = account.current.firstState.count;

    console.log("🔑 Incrementing...");
    const incrementTx = await program.rpc.increment({
      accounts: {
        stateAccount: StateAccount.publicKey,
      },
    });

    account = await program.account.stateAccount.fetch(StateAccount.publicKey);

    let incrementedCount = account.current.firstState.count;

    assert.strictEqual(account.current.firstState.count, initialCount + 1);
    console.log("Increment successful on firstState.");

    console.log("🔑 Upgrading account...");
    const upgradeTx = await program.rpc.upgradeAccount({
      accounts: {
        stateAccount: StateAccount.publicKey,
      },
    });

    account = await program.account.stateAccount.fetch(StateAccount.publicKey);

    switch (
      Object.keys(account.current).filter((key) => key.endsWith("State"))[0]
    ) {
      case "firstState":
        throw new Error("🔑 Account should not be initialized with firstState.");
      case "secondState":
        assert.ok(account.current.secondState);
        assert.equal(account.current.secondState.count, incrementedCount);
        break;
      default:
        throw new Error("Unknown state");
    }

    console.log("Account upgraded successfully.");

    console.log("🚀 Test complete!");
  });
});
