import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrderByNumber } from '@slices';
import {
  selectIngredients,
  selectOrderByNumber,
  selectOrderLoading
} from '@selectors';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams();
  const orderNumber = Number(number);

  const orderData = useSelector(selectOrderByNumber(orderNumber));
  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectOrderLoading);

  useEffect(() => {
    if (!number || Number.isNaN(orderNumber)) return;

    if (!orderData) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, number, orderNumber, orderData]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo || isLoading) {
    return <Preloader />;
  }

  return (
    <>
      <p
        className='text text_type_digits-default mb-5'
        style={{ textAlign: 'center' }}
      >
        #{String(orderInfo.number).padStart(6, '0')}
      </p>
      <OrderInfoUI orderInfo={orderInfo} />
    </>
  );
};
