const assert = require("assert");
const anchor = require('@project-serum/anchor');
const idl = require('../target/idl/mysolanaapp.json');

const { SystemProgram } = anchor.web3;

describe('mysolanaapp', () => {

  console.log("🚀 Starting test...");

  const provider = anchor.Provider.env();
  const testPublicKey = "DvgnMudAeRhqdPXTuhnyX4eU2YVkGuZ9VumD7JYkUXnE";

  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  it('Is initialized!', async () => {
    // Add your test here.
    const program = anchor.workspace.Mysolanaapp;

    console.log("🔑 Generating keys...");
    const BaseAccount = anchor.web3.Keypair.generate();

    console.log(`Key 1: ${provider.wallet.publicKey}`)
    console.log(`Key 2: ${testPublicKey}`)

    const tx = await program.rpc.create({
      accounts: {
        baseAccount: BaseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [BaseAccount],
    });

    console.log("Your transaction signature", tx);

    let account = await program.account.baseAccount.fetch(BaseAccount.publicKey);

    switch (Object.keys(account.current)
      .filter(key => key.endsWith("State"))[0]) {
      case "firstState":
        assert.ok(account.current.firstState.count.toNumber() === 0);
        break;
      case "secondState":
        assert.ok(account.current.secondState.count.toNumber() === 0);
        break;
      default:
        throw new Error("Unknown state");
    }

    account.current.firstState ? console.log("First state is set") : console.log("First state is not set");

    console.log(`Your account keys: ${Object.keys(account.current)}`);
    console.log(`Your state keys: ${Object.keys(account.current.firstState)}`);
    console.log(`👀 Counter: ${account.current.firstState.count}`);

    assert.ok(account.current.firstState.count.toNumber() === 0);

    console.log("🚀 Test complete!");

  })

  it('Can increment!', async () => {
    // Add your test here.
    const program = anchor.workspace.Mysolanaapp;

    console.log("🔑 Generating keys...");
    const BaseAccount = anchor.web3.Keypair.generate();

    console.log(`Key 1: ${provider.wallet.publicKey}`)
    console.log(`Key 2: ${testPublicKey}`)

    const tx = await program.rpc.create({
      accounts: {
        baseAccount: BaseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [BaseAccount],
    });

    console.log("Your transaction signature", tx);

    let account = await program.account.baseAccount.fetch(BaseAccount.publicKey);

    let { count } = account.current;

    console.log(`👀 Current state ${count}`);

    const result = await program.rpc.increment({
      accounts: {
        baseAccount: BaseAccount.publicKey,
      },
    });

    account = await program.account.baseAccount.fetch(BaseAccount.publicKey);

    console.log(`Incremented ${account.current}`);
  });
});


