'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import { Alert, FormHelperText } from '@mui/material';
import { smartdnsServer } from '@/lib/backend/server';
import { useUser } from '@/hooks/use-user';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';

const schema = zod.object({
  oldPassword: zod.string().min(1, { message: 'Old password is required.' }),
  password: zod.string().min(1, { message: 'New password is required.' }),
  confirmPassword: zod.string().min(1, { message: 'Confirm password is required.' }),
});

type Values = zod.infer<typeof schema>;

const fields = [
  { name: 'oldPassword' as const, label: 'Old password' as const, type: 'password' },
  { name: 'password' as const, label: 'New password' as const, type: 'password' },
  { name: 'confirmPassword' as const, label: 'Confirm password' as const, type: 'password' },
];

export function UpdatePasswordForm(): React.JSX.Element {
  const { checkSessionError } = useUser();
  const [message, setMessage] = React.useState('');
  const [showPassword, setShowPassword] = React.useState<boolean>();
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      if (values.oldPassword === values.password) {
        setError('root', { message: t('New password must be different from old password.') });
        return;
      }

      if (values.password !== values.confirmPassword) {
        setError('root', { message: t('Password mismatch.') });
        return;
      }

      const { error } = await smartdnsServer.UpdatePassword(values.oldPassword, values.password);
      if (error) {
        setError('root', { message: t(smartdnsServer.getErrorMessage(error)) });
        await checkSessionError?.(error);
        return;
      }

      setMessage(t('Password updated successfully.'));
    },
    [t, checkSessionError, setError]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
            {fields.map((field) => (
              <Controller
                key={field.name}
                control={control}
                name={field.name}
                render={({ field: controllerField }) => (
                  <FormControl fullWidth>
                    <InputLabel>{t(field.label)}</InputLabel>
                    <OutlinedInput
                      {...controllerField}
                      endAdornment={
                        showPassword ? (
                          <VisibilityOutlined
                            cursor="pointer"
                            onClick={(): void => {
                              setShowPassword(false);
                            }}
                          />
                        ) : (
                          <VisibilityOffOutlined
                            cursor="pointer"
                            onClick={(): void => {
                              setShowPassword(true);
                            }}
                          />
                        )
                      }
                      value={controllerField.value || ''}
                      label={field.label}
                      type={showPassword ? 'text' : 'password'}
                    />
                    {errors.oldPassword ? <FormHelperText>{errors.oldPassword.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
            ))}
          </Stack>
        </CardContent>
        {errors.root ? <Alert severity="error">{errors.root.message}</Alert> : null}
        {message ? <Alert severity="success">{message}</Alert> : null}
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type='submit'>{t('Update')}</Button>
        </CardActions>
      </Card>
    </form>
  );
}

