import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CarruselComponent } from './carrusel.component';

describe('CarruselComponent', () => {
  let component: CarruselComponent;
  let fixture: ComponentFixture<CarruselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarruselComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarruselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the carrusel container', () => {
    const container = fixture.debugElement.query(By.css('.fila2'));
    expect(container).toBeTruthy();
  });

  it('should render the image with correct src', () => {
    const imgElement = fixture.debugElement.query(By.css('.img_carrusel'));
    expect(imgElement).toBeTruthy();
    expect(imgElement.nativeElement.getAttribute('src')).toBe(
      'assets/images/carrusel_nuevo/2.png'
    );
  });

  it('should have contenedor_nuevo class', () => {
    const element = fixture.debugElement.query(By.css('.contenedor_nuevo'));
    expect(element).toBeTruthy();
  });

  it('should have contenedor_imagenes_nuevo class', () => {
    const element = fixture.debugElement.query(
      By.css('.contenedor_imagenes_nuevo')
    );
    expect(element).toBeTruthy();
  });

  it('should have img_carrusel class', () => {
    const img = fixture.debugElement.query(By.css('.img_carrusel'));
    expect(img.classes['img_carrusel']).toBe(true);
  });

  it('should have exactly one image', () => {
    const images = fixture.debugElement.queryAll(By.css('img'));
    expect(images.length).toBe(1);
  });

  it('should have image with .png extension', () => {
    const imgElement = fixture.debugElement.query(By.css('.img_carrusel'));
    const src = imgElement.nativeElement.getAttribute('src');
    expect(src).toContain('.png');
  });

  it('should have alt attribute', () => {
    const imgElement = fixture.debugElement.query(By.css('.img_carrusel'));
    expect(imgElement.nativeElement.hasAttribute('alt')).toBe(true);
  });
});