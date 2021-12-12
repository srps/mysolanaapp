const assert = require("assert");
const anchor = require("@project-serum/anchor");
const idl = require("../target/idl/mysolanaapp.json");

const { SystemProgram } = anchor.web3;

describe("mysolanaapp", () => {
  console.log("🚀 Starting test...");

  const provider = anchor.Provider.env();

  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  it("Is initialized!", async () => {
    // Add your test here.
    const program = anchor.workspace.Mysolanaapp;

    console.log("🔑 Generating keys...");
    const BaseAccount = anchor.web3.Keypair.generate();

    console.log(`Key 1: ${provider.wallet.publicKey}`);

    const tx = await program.rpc.create({
      accounts: {
        baseAccount: BaseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [BaseAccount],
    });

    console.log("Your transaction signature", tx);

    let account = await program.account.baseAccount.fetch(
      BaseAccount.publicKey
    );

    console.log("🔑 Account should be initialized with firstState.");
    console.log(`Account state contains: ${Object.keys(account.current)}`);
    assert.ok(account.current.firstState);

    console.log(`Account firstState count should be 0.`);
    console.log(
      `Account firstState count: ${account.current.firstState.count}`
    );
    assert.ok(account.current.firstState.count === 0);

    console.log("🔑 Account should not be initialized with secondState.");
    assert.ok(account.current.secondState === undefined);

    switch (
      Object.keys(account.current).filter((key) => key.endsWith("State"))[0]
    ) {
      case "firstState":
        assert.ok(account.current.firstState.count === 0);
        break;
      case "secondState":
        assert.ok(account.current.secondState.count === 0);
        break;
      default:
        throw new Error("Unknown state");
    }

    console.log("🚀 Test complete!");
  });

  it("Can increment!", async () => {
    // Add your test here.
    const program = anchor.workspace.Mysolanaapp;

    console.log("🔑 Generating keys...");
    const BaseAccount = anchor.web3.Keypair.generate();

    console.log(`Key 1: ${provider.wallet.publicKey}`);

    const tx = await program.rpc.create({
      accounts: {
        baseAccount: BaseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [BaseAccount],
    });

    console.log("Your transaction signature", tx);

    let account = await program.account.baseAccount.fetch(
      BaseAccount.publicKey
    );

    console.log("🔑 Account should be initialized with firstState.");
    console.log(`Account state contains: ${Object.keys(account.current)}`);
    assert.ok(account.current.firstState);

    let initialCount = account.current.firstState.count;
    console.log(`Account firstState count should be 0.`);
    console.log(`Account firstState count: ${initialCount}`);
    assert.ok(initialCount === 0);

    console.log("🔑 Account should not be initialized with secondState.");
    console.log(`Account secondState: ${account.current.secondState}`);
    assert.ok(account.current.secondState === undefined);

    console.log("🔑 Incrementing...");
    const result = await program.rpc.increment({
      accounts: {
        baseAccount: BaseAccount.publicKey,
      },
    });

    account = await program.account.baseAccount.fetch(BaseAccount.publicKey);

    console.log(`Account firstState count should be ${initialCount + 1}.`);
    console.log(
      `Account firstState count: ${account.current.firstState.count}`
    );
    assert.ok(account.current.firstState.count === initialCount + 1);

    console.log("🔑 Account should not be initialized with secondState.");
    console.log(`Account secondState: ${account.current.secondState}`);
    assert.ok(account.current.secondState === undefined);

    console.log("🚀 Test complete!");
  });

  it("Cannot decrement initial state!", async () => {
    // Add your test here.
    const program = anchor.workspace.Mysolanaapp;

    console.log("🔑 Generating keys...");
    const BaseAccount = anchor.web3.Keypair.generate();

    console.log(`Key 1: ${provider.wallet.publicKey}`);

    const tx = await program.rpc.create({
      accounts: {
        baseAccount: BaseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [BaseAccount],
    });

    console.log("Your transaction signature", tx);

    let account = await program.account.baseAccount.fetch(
      BaseAccount.publicKey
    );

    console.log("🔑 Account should be initialized with firstState.");
    console.log(`Account state contains: ${Object.keys(account.current)}`);
    assert.ok(account.current.firstState);

    let initialCount = account.current.firstState.count;
    console.log(`Account firstState count should be 0.`);
    console.log(`Account firstState count: ${initialCount}`);
    assert.ok(initialCount === 0);

    console.log("🔑 Account should not be initialized with secondState.");
    console.log(`Account secondState: ${account.current.secondState}`);
    assert.ok(account.current.secondState === undefined);

    console.log("🔑 Decrementing...");
    try {
      const result = await program.rpc.decrement({
        accounts: {
          baseAccount: BaseAccount.publicKey,
        },
      });

      account = await program.account.baseAccount.fetch(BaseAccount.publicKey);

      console.log(`Account firstState count should be ${initialCount - 1}.`);
      console.log(
        `Account firstState count: ${account.current.firstState.count}`
      );
      assert.ok(account.current.firstState.count === initialCount - 1);

      console.log("🔑 Account should not be initialized with secondState.");
      console.log(`Account secondState: ${account.current.secondState}`);
      assert.ok(account.current.secondState === undefined);
    } catch (err) {
      console.log("🔑 Error code: ", err.code);
      console.log("🔑 Error message: ", err.msg);
      assert.ok(err.message.includes("MinCountReached"));
    }

    console.log("🚀 Test complete!");
  });

  it("Initialize, increment, upgrade", async () => {
    // Add your test here.
    const program = anchor.workspace.Mysolanaapp;

    console.log("🔑 Generating keys...");
    const BaseAccount = anchor.web3.Keypair.generate();

    console.log(`Key 1: ${provider.wallet.publicKey}`);

    const tx = await program.rpc.create({
      accounts: {
        baseAccount: BaseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [BaseAccount],
    });

    console.log("Your transaction signature", tx);

    let account = await program.account.baseAccount.fetch(
      BaseAccount.publicKey
    );

    console.log("🔑 Account should be initialized with firstState.");
    console.log(`Account state contains: ${Object.keys(account.current)}`);
    assert.ok(account.current.firstState);

    let initialCount = account.current.firstState.count;
    console.log(`Account firstState count should be 0.`);
    console.log(`Account firstState count: ${initialCount}`);
    assert.ok(initialCount === 0);

    console.log("🔑 Account should not be initialized with secondState.");
    console.log(`Account secondState: ${account.current.secondState}`);
    assert.ok(account.current.secondState === undefined);

    console.log("🔑 Incrementing...");
    const incrementTx = await program.rpc.increment({
      accounts: {
        baseAccount: BaseAccount.publicKey,
      },
    });

    account = await program.account.baseAccount.fetch(BaseAccount.publicKey);

    let incrementedCount = account.current.firstState.count;
    console.log(`Account firstState count should be ${initialCount + 1}.`);
    console.log(
      `Account firstState count: ${incrementedCount}`
    );
    assert.ok(incrementedCount === initialCount + 1);

    console.log("🔑 Account should not be initialized with secondState.");
    console.log(`Account secondState: ${account.current.secondState}`);
    assert.ok(account.current.secondState === undefined);

    console.log("🔑 Upgrading...");
    const upgradeTx = await program.rpc.upgradeAccount({
      accounts: {
        baseAccount: BaseAccount.publicKey,
      },
    });

    account = await program.account.baseAccount.fetch(BaseAccount.publicKey);

    console.log("🔑 Account should be initialized with secondState.");
    console.log(`Account state contains: ${Object.keys(account.current)}`);
    assert.ok(account.current.secondState);

    let upgradedCount = account.current.secondState.count;
    console.log(`Account secondState count should be ${incrementedCount}.`);
    console.log(
      `Account secondState count: ${upgradedCount}`
    );
    assert.ok(upgradedCount == incrementedCount);
    assert.ok(upgradedCount.toNumber() === incrementedCount);

    console.log("🔑 Account should not be initialized with firstState.");
    console.log(`Account firstState: ${account.current.firstState}`);
    assert.ok(account.current.firstState === undefined);

    console.log("🚀 Test complete!");
  });
});
