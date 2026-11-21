// src/components/registration/AddressSelector.jsx
import { useEffect, useId, useState } from 'react';
import { getProvinces, getWards } from '../../api/addressApi';

export default function AddressSelector({ province, onChange, errors = {} }) {
  const provinceId = useId();
  const wardId = useId();
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [provinceCode, setProvinceCode] = useState('');
  const [wardCode, setWardCode] = useState('');
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingWards, setLoadingWards] = useState(false);
  const [provinceError, setProvinceError] = useState('');
  const [wardError, setWardError] = useState('');
  const [provinceRetry, setProvinceRetry] = useState(0);
  const [wardRetry, setWardRetry] = useState(0);

  // Tải tỉnh/thành khi mở form hoặc khi nhấn Thử tải lại.
  useEffect(() => {
    const controller = new AbortController();

    getProvinces(controller.signal)
      .then((items) => {
        if (!controller.signal.aborted) {
          setProvinces(items);
          setProvinceError('');
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setProvinceError(`Không tải được tỉnh/thành: ${error.message}`);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingProvinces(false);
      });

    return () => controller.abort();
  }, [provinceRetry]);

  // Chỉ tải danh sách phường/xã của tỉnh đã chọn.
  useEffect(() => {
    if (!provinceCode) return;

    const controller = new AbortController();
    getWards(provinceCode, controller.signal)
      .then((items) => {
        if (!controller.signal.aborted) {
          setWards(items);
          setWardError(items.length ? '' : 'Không có phường/xã nào được API trả về.');
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setWardError(`Không tải được phường/xã: ${error.message}`);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingWards(false);
      });

    return () => controller.abort();
  }, [provinceCode, wardRetry]);

  function changeProvince(event) {
    const code = event.target.value;
    const selected = provinces.find((item) => String(item.code) === code);
    setProvinceCode(code);
    setWardCode('');
    setWards([]);
    setWardError('');
    setLoadingWards(Boolean(code));
    onChange({ province: selected?.name ?? '', ward: '' });
  }

  function changeWard(event) {
    const code = event.target.value;
    const selected = wards.find((item) => String(item.code) === code);
    setWardCode(code);
    onChange({ province, ward: selected?.name ?? '' });
  }

  function retryProvinces() {
    setProvinceError('');
    setLoadingProvinces(true);
    setProvinceRetry((n) => n + 1);
  }

  function retryWards() {
    setWardError('');
    setWards([]);
    setWardCode('');
    setLoadingWards(true);
    onChange({ province, ward: '' });
    setWardRetry((n) => n + 1);
  }

  return (
    <div className="bd-reg-grid-two">
      <div className="bd-reg-field">
        <label htmlFor={provinceId} className="bd-reg-label">
          Tỉnh/Thành phố <span className="bd-reg-required">*</span>
        </label>
        <select
          id={provinceId}
          name="province"
          className={`bd-reg-input bd-reg-select ${errors.province ? 'bd-reg-input-error' : ''}`}
          value={provinceCode}
          onChange={changeProvince}
          disabled={loadingProvinces}
          required
        >
          <option value="">
            {loadingProvinces ? 'Đang tải tỉnh/thành...' : 'Chọn tỉnh/thành phố'}
          </option>
          {provinces.map((item) => (
            <option key={item.code} value={String(item.code)}>{item.name}</option>
          ))}
        </select>
        {provinceError && (
          <div className="bd-reg-error" role="alert">
            {provinceError}{' '}
            <button type="button" onClick={retryProvinces}>Thử tải lại</button>
          </div>
        )}
        {errors.province && <span className="bd-reg-error">{errors.province}</span>}
      </div>

      <div className="bd-reg-field">
        <label htmlFor={wardId} className="bd-reg-label">
          Phường/Xã/Đặc khu <span className="bd-reg-required">*</span>
        </label>
        <select
          id={wardId}
          name="ward"
          className={`bd-reg-input bd-reg-select ${errors.ward ? 'bd-reg-input-error' : ''}`}
          value={wardCode}
          onChange={changeWard}
          disabled={!provinceCode || loadingWards || wards.length === 0}
          required
        >
          <option value="">
            {!provinceCode
              ? 'Chọn tỉnh/thành trước'
              : loadingWards ? 'Đang tải phường/xã...' : 'Chọn phường/xã/đặc khu'}
          </option>
          {wards.map((item) => (
            <option key={item.code} value={String(item.code)}>{item.name}</option>
          ))}
        </select>
        {wardError && (
          <div className="bd-reg-error" role="alert">
            {wardError}{' '}
            <button type="button" onClick={retryWards}>Thử tải lại</button>
          </div>
        )}
        {errors.ward && <span className="bd-reg-error">{errors.ward}</span>}
      </div>
    </div>
  );
}