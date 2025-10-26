import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

export function SmartScreenWarning() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-xs text-muted-foreground px-0">
          <AlertCircle className="w-3 h-3 mr-1" />
          Предупреждение Windows?
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            Предупреждение Windows SmartScreen
          </DialogTitle>
          <DialogDescription>
            Информация о предупреждении безопасности Windows
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Что вы увидите при установке:</AlertTitle>
            <AlertDescription>
              <div className="mt-2 space-y-2">
                <p className="font-semibold">
                  "Система Windows защитила ваш компьютер"
                </p>
                <p className="text-sm text-muted-foreground">
                  Фильтр SmartScreen в Microsoft Defender предотвратил запуск
                  неопознанного приложения
                </p>
              </div>
            </AlertDescription>
          </Alert>

          <div>
            <h4 className="font-semibold mb-2">✅ Это нормально!</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Приложение Aurora Rise **безопасно**, но Windows блокирует
              неподписанные приложения от новых издателей.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Как установить:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                Нажмите{' '}
                <span className="font-semibold text-primary">"Подробнее"</span> в
                окне SmartScreen
              </li>
              <li>
                Нажмите{' '}
                <span className="font-semibold text-primary">
                  "Выполнить в любом случае"
                </span>
              </li>
              <li>Следуйте инструкциям установщика</li>
            </ol>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Почему это происходит?</h4>
            <p className="text-sm text-muted-foreground">
              Цифровая подпись кода стоит ~$100-400/год. Мы работаем над получением
              сертификата. После накопления репутации или покупки сертификата это
              предупреждение исчезнет.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm">
              💡 <strong>Совет:</strong> Вы всегда можете проверить подлинность
              файла, сравнив его хэш-сумму (SHA256) на нашем официальном сайте.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

