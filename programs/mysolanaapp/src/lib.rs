use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod mysolanaapp {
    use super::*;
    pub fn create(ctx: Context<Create>) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        let first_state = Some(State::FirstState {
            count: 0,
        });
        base_account.current = first_state;
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        match &mut base_account.current {
            Some(State::FirstState { count }) => {
                if *count == u32::MAX {
                    return Err(CustomError::MaxCountReached.into());
                }
                msg!("Incrementing First State count from {} to {}", count, *count + 1);
                *count += 1;
            }
            Some(State::SecondState { count }) => {
                if *count == u64::MAX {
                    return Err(CustomError::MaxCountReached.into());
                }
                msg!("Incrementing Second State count from {} to {}", count, *count + 1);
                *count += 1;
            }
            _ => {
                return Err(ProgramError::InvalidAccountData);
            }
        }
        
        Ok(())
    }

    pub fn decrement(ctx: Context<Decrement>) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        match &mut base_account.current {
            Some(State::FirstState { count }) => {
                if *count == u32::MIN {
                    msg!("Cannot decrement State count from 0");
                    return Err(CustomError::MinCountReached.into());
                }
                msg!("Decrementing First State count from {} to {}", count, *count - 1);
                *count -= 1;
            }
            Some(State::SecondState { count }) => {
                if *count == u64::MIN {
                    msg!("Cannot decrement State count from 0");
                    return Err(CustomError::MinCountReached.into());
                }
                msg!("Decrementing Second State count from {} to {}", count, *count - 1);
                *count -= 1;
            }
            _ => {
                return Err(ProgramError::InvalidAccountData);
            }
        }

        Ok(())
    }

    pub fn upgrade_account(ctx: Context<UpgradeAccount>) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        match &mut base_account.current {
            Some(State::FirstState { count }) => {
                msg!("Upgrading First State to Second State");
                base_account.current = Some(State::SecondState { count: *count as u64 });
            }
            Some(State::SecondState { .. }) => {
                //Nothing to do
            }
            _ => {
                return Err(ProgramError::InvalidAccountData);
            }
        }

        Ok(())
    }

}

#[error]
pub enum CustomError {
    MaxCountReached,
    MinCountReached,
}

#[derive(Accounts)]
pub struct Create<'info> {
    #[account(init, payer = user, space = 8 + 8 + 32)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>
}

#[derive(Accounts)]
pub struct Decrement<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>
}

#[derive(Accounts)]
pub struct UpgradeAccount<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>
}

#[account]
#[derive(Default)]
pub struct BaseAccount {
    pub current: Option<State>,
}
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum State {
    FirstState { count: u32 },
    SecondState { count: u64 },
}
