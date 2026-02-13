import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { ProfileUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { updateUser } from '@slices';
import { selectAuthError, selectUser } from '@selectors';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const updateUserError = useSelector(selectAuthError) || undefined;

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== (user?.name || '') ||
    formValue.email !== (user?.email || '') ||
    Boolean(formValue.password);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const payload: { name?: string; email?: string; password?: string } = {};

    if (formValue.name !== (user?.name || '')) payload.name = formValue.name;
    if (formValue.email !== (user?.email || ''))
      payload.email = formValue.email;
    if (formValue.password) payload.password = formValue.password;

    if (!Object.keys(payload).length) {
      return;
    }

    dispatch(updateUser(payload)).then((result) => {
      if (updateUser.fulfilled.match(result)) {
        setFormValue((prevState) => ({
          ...prevState,
          password: ''
        }));
      }
    });
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
