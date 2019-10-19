import { OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, Component } from '@angular/core';
import { CalendarView, CalendarEvent, CalendarEventTimesChangedEvent, CalendarEventAction } from 'angular-calendar';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppointmantsService } from 'src/app/services/appointmants.service';
import { map, tap } from 'rxjs/operators';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-appointments',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  activeDayIsOpen = true;

  constructor(
    private modal: NgbModal,
    private appointmentsService: AppointmantsService) { }

  ngOnInit() {
    this.events.push(
      {
        start: new Date(),
        end: new Date(new Date().getTime() + 30 * 60000),
        title: 'Appointment at doctor Sandra',
        color: colors.blue,
        allDay: false
      },
      {
        start: this.minusDays(new Date(), 3),
        end: new Date(this.minusDays(new Date(), 3).getTime() + 30 * 60000),
        title: 'Appointment at doctor Smith',
        color: colors.blue
      },
      {
        start: this.minusDays(new Date(), 2),
        end: new Date(this.minusDays(new Date(), 2).getTime() + 30 * 60000),
        title: 'Appointment at doctor John',
        color: colors.blue
      },
      {
        start: this.minusDays(new Date(), 1),
        end: new Date(this.minusDays(new Date(), 1).getTime() + 30 * 60000),
        title: 'Appointment at doctor Snow',
        color: colors.blue
      },
      {
        start: this.minusDays(new Date(), 4),
        end: new Date(this.minusDays(new Date(), 4).getTime() + 30 * 60000),
        title: 'Appointment at doctor Jenny',
        color: colors.blue
      },
      {
        start: this.minusDays(new Date(), 1),
        end: new Date(this.minusDays(new Date(), 1).getTime() + 30 * 60000),
        title: 'Appointment at doctor George',
        color: colors.blue
      });
  }

  minusDays(date: Date, days): Date {
    const date1 = new Date();

    date1.setDate(date.getDate() - days);
    return date1;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    console.log('Delete event');
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      }
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
