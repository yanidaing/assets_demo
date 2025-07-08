import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AiOutlineCalendar, AiOutlineFilter, AiOutlineDown, AiOutlineEllipsis, AiOutlineEdit, AiOutlinePlus, AiOutlineDelete, AiOutlineBarcode } from 'react-icons/ai';
import styles from './AssetsTable.module.css';
import Pagination from '../Pagination';
import { apiService, Asset } from '../../services/api';
import { formatDate } from '../../lib/dateUtils';
import Swal from 'sweetalert2';
import Barcode from 'react-barcode';
import jsPDF from 'jspdf';
import ReactDOM from 'react-dom';
import dynamic from 'next/dynamic';
const BarcodeScannerModal = dynamic(() => import('../BarcodeScannerModal'), { ssr: false });

interface AssetsTableProps {
  searchTerm?: string;
  isAdmin?: boolean;
  selectedBarcode?: string | null;
}

const AssetsTable: React.FC<AssetsTableProps> = ({ searchTerm = '', isAdmin = false, selectedBarcode }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editAsset, setEditAsset] = useState<Asset | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [agencyFilter, setAgencyFilter] = useState<string>('All');
  const [agencyDropdownOpen, setAgencyDropdownOpen] = useState(false);
  const agencyDropdownRef = React.useRef<HTMLDivElement>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: '',
    Location: '',
    Agency: '',
    Date: '',
    status: 'Activated',
    image: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const locationDropdownRef = React.useRef<HTMLDivElement>(null);
  const [agencyDropdownOpenAdd, setAgencyDropdownOpenAdd] = useState(false);
  const agencyDropdownAddRef = React.useRef<HTMLDivElement>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);

  // ดึงข้อมูล assets จาก API
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const data = await apiService.getAssets();
        setAssets(data);
        setError(null);
      } catch (err) {
        setError('Failed to load assets');
        console.error('Error fetching assets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  useEffect(() => {
    if (selectedBarcode && assets.length > 0) {
      console.log('Scanned barcode:', selectedBarcode);
      const found = assets.find(a => a.Barcode === selectedBarcode);
      if (found) {
        Swal.fire({
          icon: 'success',
          title: 'สแกนสำเร็จ',
          text: `พบ asset: ${found.name} (Barcode: ${selectedBarcode})`,
        });
        setSelectedAsset(found);
        setShowModal(true);
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'สแกนสำเร็จ',
          text: `ไม่พบ asset ที่ตรงกับ barcode นี้ในระบบ (Barcode: ${selectedBarcode})`,
        });
      }
    }
  }, [selectedBarcode, assets]);

  const handleCalendarClick = async () => {
    const result = await Swal.fire({
      title: 'Select date',
      input: 'date',
      inputLabel: 'Filter assets by date',
      showCancelButton: true,
      confirmButtonText: 'Filter',
      cancelButtonText: 'Cancel',
      inputValue: dateFilter || '',
      didOpen: () => {
        const input = Swal.getInput();
        if (input) {
          input.addEventListener('input', function (e) {
            const val = (e.target as HTMLInputElement).value;
            const preview = document.getElementById('swal-date-preview');
            if (preview) {
              if (val) {
                const d = new Date(val);
                if (!isNaN(d.getTime())) {
                  const day = d.getDate();
                  const month = d.toLocaleString('en-US', { month: 'short' });
                  const year = d.getFullYear();
                  preview.textContent = `${month} ${day} ${year}`;
                } else {
                  preview.textContent = '';
                }
              } else {
                preview.textContent = '';
              }
            }
          });
        }
      },
      html: `<div id="swal-date-preview" style="margin-top:8px;font-size:1.1em;color:#4f46e5;"></div>`
    });
    if (result.isConfirmed && result.value) {
      setDateFilter(result.value);
      setCurrentPage(1);
    }
  };

  const agencyList = Array.from(new Set(assets.map(a => a.Agency).filter(Boolean)));
  const locationList = Array.from(new Set(assets.map(a => a.Location).filter(Boolean)));

  const filteredAssets = assets.filter(asset => {
    const statusMatch = activeFilter === 'All' || asset.status === activeFilter;
    const dateMatch = !dateFilter || (asset.Date && asset.Date.slice(0, 10) === dateFilter);
    const agencyMatch = agencyFilter === 'All' || asset.Agency === agencyFilter;
    const search = searchTerm.trim().toLowerCase();
    const searchMatch = !search || [
      asset.name,
      asset.Location,
      asset.Agency,
      asset.status,
      asset.Date && formatDate(asset.Date)
    ].some(val => val && val.toString().toLowerCase().includes(search));
    return statusMatch && dateMatch && agencyMatch && searchMatch;
  });

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const currentAssets = filteredAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusClass = (status: Asset['status']) => {
    switch (status) {
      case 'Activated': return styles.statusActivated;
      case 'Lost': return styles.statusLost;
      case 'Damaged': return styles.statusDamaged;
      default: return '';
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (agencyDropdownRef.current && !agencyDropdownRef.current.contains(event.target as Node)) {
        setAgencyDropdownOpen(false);
      }
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setLocationDropdownOpen(false);
      }
      if (agencyDropdownAddRef.current && !agencyDropdownAddRef.current.contains(event.target as Node)) {
        setAgencyDropdownOpenAdd(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const printBarcode = (barcode: string) => {
    const printWindow = window.open('', '', 'width=400,height=250');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Barcode</title>
          <style>
            body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
          </style>
        </head>
        <body>
          <div id="barcode"></div>
          <div style="margin-top: 12px; font-size: 18px;">${barcode}</div>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
          <svg id="svgbarcode"></svg>
          <script>
            window.onload = function() {
              JsBarcode("#svgbarcode", "${barcode}", {width:2, height:60, fontSize:18});
              document.getElementById('barcode').appendChild(document.getElementById('svgbarcode'));
              setTimeout(function() { window.print(); window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const printBarcodeAsPDF = (barcode: string) => {
    // สร้าง SVG barcode ชั่วคราวใน DOM
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'fixed';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);
    // สร้าง SVG element
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('id', 'svgbarcode');
    svg.setAttribute('width', '120');
    svg.setAttribute('height', '36');
    tempDiv.appendChild(svg);
    // โหลด JsBarcode ถ้ายังไม่มี
    function generateAndSave() {
      // @ts-ignore
      window.JsBarcode(svg, barcode, { width: 1.2, height: 36, fontSize: 12 });
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new window.Image();
      img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = 120;
        canvas.height = 36;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          const imgData = canvas.toDataURL('image/png');
          // สร้าง PDF ขนาด A4
          const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const imgX = (pageWidth - 120) / 2;
          const imgY = pageHeight / 2 - 36;
          pdf.addImage(imgData, 'PNG', imgX, imgY, 120, 36);
          pdf.setFontSize(12);
          pdf.text(barcode, pageWidth / 2, imgY + 50, { align: 'center' });
          pdf.save(`barcode_${barcode}.pdf`);
        }
        URL.revokeObjectURL(url);
        document.body.removeChild(tempDiv);
      };
      img.src = url;
    }
    if (typeof window.JsBarcode === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js';
      script.onload = generateAndSave;
      document.body.appendChild(script);
    } else {
      generateAndSave();
    }
  };

  if (loading) {
    return (
      <section className={styles.assetsSection}>
        <div className={styles.assetsHeader}>
          <div>
            <h2>Assets</h2>
            <p>Loading assets...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.assetsSection}>
        <div className={styles.assetsHeader}>
          <div>
            <h2>Assets</h2>
            <p style={{ color: 'red' }}>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.assetsSection}>
      <div className={styles.assetsHeader}>
        <div>
          
          <p className={styles.totalAssets}>Total {assets.length} assets</p>
          <p className={styles.listOfEquipment}>List of equipment</p>
        </div>
      </div>

      <div className={styles.assetsControls}>
        <div className={styles.statusFilters}>
          {['All', 'Activated', 'Lost', 'Damaged'].map(status => (
            <button
              key={status}
              className={`${styles.filterButton} ${activeFilter === status ? styles.active : ''}`}
              onClick={() => {
                setActiveFilter(status as Asset['status'] | 'All');
                setCurrentPage(1);
              }}
            >
              {status}
            </button>
          ))}
        </div>
        <div className={styles.rightControls}>
          <button className={styles.iconButton} onClick={handleCalendarClick} title="Filter by date">
            <AiOutlineCalendar />
          </button>
          <button className={styles.iconButton} onClick={() => setShowScanner(true)} title="Scan Barcode" style={{marginLeft: 8}}>
            <AiOutlineBarcode />
          </button>
          {dateFilter && (
            <button className={styles.cancelButton} style={{marginLeft: 8}} onClick={() => setDateFilter(null)}>
              Clear Date
            </button>
          )}
          <div
            className={styles.customDropdown}
            ref={agencyDropdownRef}
            tabIndex={0}
            onClick={() => setAgencyDropdownOpen(open => !open)}
            style={{ minWidth: 140, marginLeft: 8, position: 'relative' }}
          >
            <div className={styles.customDropdownSelected}>
              {agencyFilter === 'All' ? 'All Agencies' : agencyFilter}
              <AiOutlineDown className={styles.dropdownIcon} />
            </div>
            {agencyDropdownOpen && (
              <ul className={styles.customDropdownList}>
                <li
                  className={agencyFilter === 'All' ? styles.activeDropdownItem : ''}
                  onClick={e => { e.stopPropagation(); setAgencyFilter('All'); setCurrentPage(1); setAgencyDropdownOpen(false); }}
                >All Agencies</li>
                {agencyList.map(agency => (
                  <li
                    key={agency}
                    className={agencyFilter === agency ? styles.activeDropdownItem : ''}
                    onClick={e => { e.stopPropagation(); setAgencyFilter(agency); setCurrentPage(1); setAgencyDropdownOpen(false); }}
                  >{agency}</li>
                ))}
              </ul>
            )}
          </div>
          {isAdmin && (
            <button className={styles.filterButton} style={{marginLeft: 8, display: 'flex', alignItems: 'center'}} onClick={() => setShowAddModal(true)}>
              <AiOutlinePlus style={{marginRight: 4}} /> Add Asset
            </button>
          )}
        </div>
      </div>

      <div className={styles.assetsTableContainer}>
        <table className={styles.assetsTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Location</th>
              <th>Agency</th>
              <th>Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentAssets.map(asset => (
              <tr key={asset.id} onClick={() => { setSelectedAsset(asset); setShowModal(true); }} style={{ cursor: 'pointer' }}>
                <td>{asset.id}</td>
                <td>
                  <Image
                    src={asset.image || '/mfu-logo.png'}
                    alt={asset.name}
                    width={60}
                    height={60}
                    className={styles.assetImage}
                  />
                </td>
                <td>{asset.name}</td>
                <td>{asset.Location}</td>
                <td>{asset.Agency}</td>
                <td>{formatDate(asset.Date)}</td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusClass(asset.status)}`}>
                    {asset.status}
                  </span>
                </td>
                <td>
                  <button
                    className={styles.deleteButton}
                    title="Delete"
                    onClick={async e => {
                      e.stopPropagation();
                      const result = await Swal.fire({
                        title: 'Are you sure?',
                        text: 'You won\'t be able to revert this!',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#3085d6',
                        confirmButtonText: 'Yes, delete it!'
                      });
                      if (result.isConfirmed) {
                        try {
                          await apiService.deleteAsset(asset.id);
                          setAssets(prev => prev.filter(a => a.id !== asset.id));
                          Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Asset has been deleted.' });
                        } catch (err) {
                          Swal.fire({ icon: 'error', title: 'Error', text: 'Delete failed' });
                        }
                      }
                    }}
                  >
                    <AiOutlineDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {showModal && selectedAsset && (
        <div className={styles.modalOverlay} onClick={() => { setShowModal(false); setEditMode(false); }}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.editButton} title="Edit" onClick={() => { setEditMode(true); setEditAsset(selectedAsset); }}>
              <AiOutlineEdit />
            </button>
            <button className={styles.closeButton} onClick={() => { setShowModal(false); setEditMode(false); }} title="Close">×</button>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 32, minWidth: 400 }}>
              <div className={styles.detailImageWrapper} style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Image
                  src={(editMode ? editAsset?.image : selectedAsset.image) || '/mfu-logo.png'}
                  alt={(editMode ? editAsset?.name : selectedAsset.name)}
                  width={120}
                  height={120}
                  className={styles.assetImage}
                />
                <div style={{margin: '16px 0 0 0'}}>
                  <Barcode value={(editMode ? editAsset.Barcode : selectedAsset.Barcode) || ''} width={1.5} height={50} fontSize={14} />
                </div>
                <button
                  style={{marginTop: 12, padding: '6px 18px', borderRadius: 6, background: '#333', color: '#fff', border: 'none', cursor: 'pointer'}}
                  onClick={() => printBarcodeAsPDF(editMode ? editAsset.Barcode : selectedAsset.Barcode)}
                >
                  Save Barcode as PDF
                </button>
              </div>
              <div className={styles.detailInfo} style={{ flex: 1 }}>
                {editMode && editAsset ? (
                  <>
                    <div><b>ID:</b> {editAsset.id}</div>
                    <div><b>Name:</b> <input value={editAsset.name} onChange={e => setEditAsset({ ...editAsset, name: e.target.value })} /></div>
                    <div><b>Barcode:</b> <input value={editAsset.Barcode} onChange={e => setEditAsset({ ...editAsset, Barcode: e.target.value })} style={{width: '80%'}} /></div>
                    <div><b>Location:</b> <input value={editAsset.Location} onChange={e => setEditAsset({ ...editAsset, Location: e.target.value })} /></div>
                    <div><b>Agency:</b> <input value={editAsset.Agency} onChange={e => setEditAsset({ ...editAsset, Agency: e.target.value })} /></div>
                    <div><b>Date:</b> <input type="date" value={editAsset.Date ? editAsset.Date.slice(0,10) : ''} onChange={e => setEditAsset({ ...editAsset, Date: e.target.value })} /></div>
                    <div><b>Status:</b> <select value={editAsset.status} onChange={e => setEditAsset({ ...editAsset, status: e.target.value as Asset['status'] })}>
                      <option value="Activated">Activated</option>
                      <option value="Lost">Lost</option>
                      <option value="Damaged">Damaged</option>
                    </select></div>
                    <div className={styles.modalActions}>
                      <button className={styles.saveButton} onClick={async () => {
                        try {
                          const updated = await apiService.updateAsset(editAsset);
                          setSelectedAsset(updated);
                          setAssets(prev => prev.map(a => a.id === updated.id ? updated : a));
                          setEditMode(false);
                          Swal.fire({ icon: 'success', title: 'Saved!', text: 'Asset updated successfully.' });
                        } catch (err) {
                          Swal.fire({ icon: 'error', title: 'Error', text: 'Update failed' });
                        }
                      }}>Save</button>
                      <button className={styles.cancelButton} onClick={() => setEditMode(false)}>Cancel</button>
                      <button className={styles.deleteButton} onClick={async () => {
                        const result = await Swal.fire({
                          title: 'Are you sure?',
                          text: 'You won\'t be able to revert this!',
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#d33',
                          cancelButtonColor: '#3085d6',
                          confirmButtonText: 'Yes, delete it!'
                        });
                        if (result.isConfirmed) {
                          try {
                            await apiService.deleteAsset(editAsset.id);
                            setShowModal(false);
                            setAssets(prev => prev.filter(a => a.id !== editAsset.id));
                            Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Asset has been deleted.' });
                          } catch (err) {
                            Swal.fire({ icon: 'error', title: 'Error', text: 'Delete failed' });
                          }
                        }
                      }}>Delete</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div><b>ID:</b> {selectedAsset.id}</div>
                    <div><b>Name:</b> {selectedAsset.name}</div>
                    <div><b>Barcode:</b> {selectedAsset.Barcode}</div>
                    <div><b>Location:</b> {selectedAsset.Location}</div>
                    <div><b>Agency:</b> {selectedAsset.Agency}</div>
                    <div><b>Date:</b> {formatDate(selectedAsset.Date)}</div>
                    <div><b>Status:</b> {selectedAsset.status}</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setShowAddModal(false)} title="Close">×</button>
            <h3 style={{marginBottom: 16}}>Add New Asset</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              let imageUrl = '';
              if (imageFile) {
                // Convert image to base64
                const reader = new FileReader();
                imageUrl = await new Promise<string>((resolve) => {
                  reader.onload = () => resolve(reader.result as string);
                  reader.readAsDataURL(imageFile);
                });
              }
              try {
                const created = await apiService.addAsset({
                  ...newAsset,
                  Date: new Date().toISOString().slice(0, 10),
                  image: imageUrl || '',
                });
                setAssets(prev => [...prev, created]);
                setShowAddModal(false);
                setNewAsset({ name: '', Location: '', Agency: '', Date: '', status: 'Activated', image: '' });
                setImageFile(null);
                Swal.fire({ icon: 'success', title: 'Added!', text: 'Asset added successfully.' });
              } catch (err) {
                Swal.fire({ icon: 'error', title: 'Error', text: 'Add failed' });
              }
            }} style={{display: 'flex', flexDirection: 'column', gap: 12}}>
              <input required placeholder="Name" value={newAsset.name} onChange={e => setNewAsset({ ...newAsset, name: e.target.value })} />
              <div
                className={styles.customDropdown}
                ref={locationDropdownRef}
                tabIndex={0}
                onClick={() => setLocationDropdownOpen(open => !open)}
                style={{ minWidth: 140, marginBottom: 8, position: 'relative' }}
              >
                <div className={styles.customDropdownSelected}>
                  {newAsset.Location ? newAsset.Location : 'Select Location'}
                  <AiOutlineDown className={styles.dropdownIcon} />
                </div>
                {locationDropdownOpen && (
                  <ul className={styles.customDropdownList} style={{maxHeight: '11.2rem', overflowY: 'auto'}}>
                    {locationList.map(loc => (
                      <li
                        key={loc}
                        className={newAsset.Location === loc ? styles.activeDropdownItem : ''}
                        onClick={e => { e.stopPropagation(); setNewAsset({ ...newAsset, Location: loc }); setLocationDropdownOpen(false); }}
                      >{loc}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div
                className={styles.customDropdown}
                ref={agencyDropdownAddRef}
                tabIndex={0}
                onClick={() => setAgencyDropdownOpenAdd(open => !open)}
                style={{ minWidth: 140, marginBottom: 8, position: 'relative' }}
              >
                <div className={styles.customDropdownSelected}>
                  {newAsset.Agency ? newAsset.Agency : 'Select Agency'}
                  <AiOutlineDown className={styles.dropdownIcon} />
                </div>
                {agencyDropdownOpenAdd && (
                  <ul className={styles.customDropdownList} style={{maxHeight: '11.2rem', overflowY: 'auto'}}>
                    {agencyList.map(agency => (
                      <li
                        key={agency}
                        className={newAsset.Agency === agency ? styles.activeDropdownItem : ''}
                        onClick={e => { e.stopPropagation(); setNewAsset({ ...newAsset, Agency: agency }); setAgencyDropdownOpenAdd(false); }}
                      >{agency}</li>
                    ))}
                  </ul>
                )}
              </div>
              <select value={newAsset.status} onChange={e => setNewAsset({ ...newAsset, status: e.target.value as Asset['status'] })}>
                <option value="Activated">Activated</option>
                <option value="Lost">Lost</option>
                <option value="Damaged">Damaged</option>
              </select>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
              <button className={styles.saveButton} type="submit">Add Asset</button>
            </form>
          </div>
        </div>
      )}

      {showScanner && (
        <BarcodeScannerModal
          onClose={() => setShowScanner(false)}
          onDetected={barcode => {
            setShowScanner(false);
            setScannedBarcode(barcode);
            if (typeof window !== 'undefined') {
              // scroll to top for modal
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        />
      )}
    </section>
  );
};

export default AssetsTable;