import { LaunchpadFormData } from '@/types/forms';

export interface ValidationErrors {
  [key: string]: string;
}

export const validateBridgeForm = (
  sourceChain: string,
  destChain: string,
  amount: string,
  balance: string
): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (sourceChain === destChain) {
    errors.chain = 'Source and destination chains must be different';
  }

  const amountNum = parseFloat(amount);
  const balanceNum = parseFloat(balance);

  if (!amount) {
    errors.amount = 'Amount is required';
  } else if (isNaN(amountNum) || amountNum <= 0) {
    errors.amount = 'Amount must be greater than 0';
  } else if (amountNum > balanceNum) {
    errors.amount = 'Insufficient balance';
  }

  return errors;
};

export const validateLaunchpadForm = (data: LaunchpadFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.chainName) {
    errors.chainName = 'Chain name is required';
  } else if (data.chainName.length < 3) {
    errors.chainName = 'Chain name must be at least 3 characters';
  }

  if (!data.symbol) {
    errors.symbol = 'Symbol is required';
  } else if (!/^[A-Z0-9]{2,10}$/.test(data.symbol)) {
    errors.symbol = 'Symbol must be 2-10 uppercase letters or numbers';
  }

  if (data.initialValidators < 1) {
    errors.initialValidators = 'Must have at least 1 validator';
  }

  if (data.blockTime < 1) {
    errors.blockTime = 'Block time must be at least 1 second';
  }

  if (!data.maxSupply || isNaN(Number(data.maxSupply))) {
    errors.maxSupply = 'Valid max supply is required';
  }

  if (!data.subnetThreshold || isNaN(Number(data.subnetThreshold))) {
    errors.subnetThreshold = 'Valid subnet threshold is required';
  }

  return errors;
}; 